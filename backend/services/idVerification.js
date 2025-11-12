/**
 * Free ID Verification Service
 * Uses Tesseract OCR for ID document verification
 */

let Tesseract, sharp;
try {
  Tesseract = require('tesseract.js');
  sharp = require('sharp');
} catch (error) {
  console.warn('⚠️  Tesseract.js or Sharp not installed. Install with: npm install tesseract.js sharp');
}

const fs = require('fs').promises;
const path = require('path');

class FreeIDVerification {
  /**
   * Preprocess image to improve OCR accuracy
   */
  async preprocessImage(imagePath) {
    try {
      if (!sharp) {
        throw new Error('Sharp library not installed. Run: npm install sharp');
      }
      
      const processedPath = imagePath.replace(/\.[^.]+$/, '_processed.jpg');
      
      // Enhance image quality
      await sharp(imagePath)
        .greyscale() // Convert to grayscale
        .normalize() // Normalize contrast
        .sharpen() // Sharpen edges
        .resize(2000, null, { // Resize for better OCR (max width 2000px)
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFile(processedPath);
      
      return processedPath;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      // Return original if preprocessing fails
      return imagePath;
    }
  }

  /**
   * Extract ID number from image using OCR
   */
  async extractIDNumber(imagePath, idType) {
    try {
      if (!Tesseract) {
        throw new Error('Tesseract.js not installed. Run: npm install tesseract.js');
      }
      
      // Preprocess image
      const processedPath = await this.preprocessImage(imagePath);
      
      // Configure OCR based on ID type
      const config = {
        lang: 'eng',
        // Whitelist characters based on ID type
        tessedit_char_whitelist: this.getCharacterWhitelist(idType)
      };

      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(
        processedPath,
        'eng',
        config
      );

      // Clean up processed image
      try {
        if (processedPath !== imagePath) {
          await fs.unlink(processedPath);
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup processed image:', cleanupError);
      }

      // Extract ID number using regex patterns
      const extracted = this.extractIDFromText(text, idType);
      
      return {
        idNumber: extracted.idNumber,
        confidence: extracted.confidence,
        rawText: text.substring(0, 200) // Store first 200 chars for debugging
      };
    } catch (error) {
      console.error('OCR extraction error:', error);
      return {
        idNumber: null,
        confidence: 0,
        error: error.message
      };
    }
  }

  /**
   * Get character whitelist based on ID type
   */
  getCharacterWhitelist(idType) {
    const whitelists = {
      aadhaar: '0123456789 ',
      pan: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      passport: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      driving: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ ',
      voter: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ/ ',
      other: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ/- '
    };
    return whitelists[idType] || whitelists.other;
  }

  /**
   * Extract ID number from OCR text using regex patterns
   */
  extractIDFromText(text, idType) {
    const patterns = {
      aadhaar: [
        /\b\d{4}\s?\d{4}\s?\d{4}\b/, // Standard format: 1234 5678 9012
        /\b\d{12}\b/ // No spaces: 123456789012
      ],
      pan: [
        /\b[A-Z]{5}\d{4}[A-Z]\b/ // Format: ABCDE1234F
      ],
      passport: [
        /\b[A-Z]\d{7,9}\b/, // Format: A1234567
        /\b[A-Z]{1,2}\d{6,9}\b/ // Format: AB1234567
      ],
      driving: [
        /\b[A-Z]{2}\d{2}\s?\d{4}\s?\d{7}\b/, // Format: DL 12 3456 7890123
        /\b[A-Z]{2}\d{2}\d{4}\d{7}\b/ // No spaces
      ],
      voter: [
        /\b[A-Z]{3}\d{7}\b/, // Format: ABC1234567
        /\b\d{10}\b/ // 10 digits
      ],
      other: [
        /\b[A-Z0-9]{8,15}\b/ // Generic: 8-15 alphanumeric
      ]
    };

    const idPatterns = patterns[idType] || patterns.other;
    
    for (const pattern of idPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Clean the matched ID (remove spaces, normalize)
        const cleanedId = match[0].replace(/\s/g, '').toUpperCase();
        return {
          idNumber: cleanedId,
          confidence: 0.8 // Medium confidence for OCR
        };
      }
    }

    return {
      idNumber: null,
      confidence: 0
    };
  }

  /**
   * Verify ID document
   */
  async verifyID(idType, userProvidedIdNumber, imagePath) {
    try {
      // Extract ID number from image
      const extracted = await this.extractIDNumber(imagePath, idType);
      
      if (!extracted.idNumber) {
        return {
          verified: false,
          confidence: 0,
          error: 'Could not extract ID number from document',
          extractedData: extracted
        };
      }

      // Normalize both IDs for comparison (remove spaces, convert to uppercase)
      const normalizedProvided = userProvidedIdNumber.replace(/\s/g, '').toUpperCase();
      const normalizedExtracted = extracted.idNumber.replace(/\s/g, '').toUpperCase();

      // Check if IDs match
      const isMatch = normalizedProvided === normalizedExtracted;
      
      // Calculate confidence
      let confidence = extracted.confidence;
      if (isMatch) {
        confidence = Math.min(0.95, confidence + 0.15); // Boost confidence if match
      } else {
        confidence = Math.max(0.1, confidence - 0.3); // Lower confidence if no match
      }

      return {
        verified: isMatch,
        confidence: confidence,
        extractedData: {
          extractedIdNumber: extracted.idNumber,
          userProvidedIdNumber: userProvidedIdNumber,
          match: isMatch,
          rawText: extracted.rawText
        }
      };
    } catch (error) {
      console.error('ID verification error:', error);
      return {
        verified: false,
        confidence: 0,
        error: error.message,
        extractedData: null
      };
    }
  }

  /**
   * Basic document validation (check if image is valid)
   */
  async validateDocument(imagePath) {
    try {
      if (!sharp) {
        throw new Error('Sharp library not installed. Run: npm install sharp');
      }
      
      const metadata = await sharp(imagePath).metadata();
      
      // Check if image is too small
      if (metadata.width < 200 || metadata.height < 200) {
        return {
          valid: false,
          error: 'Image too small. Minimum size: 200x200 pixels'
        };
      }

      // Check if image is too large (to prevent memory issues)
      if (metadata.width > 5000 || metadata.height > 5000) {
        return {
          valid: false,
          error: 'Image too large. Maximum size: 5000x5000 pixels'
        };
      }

      return {
        valid: true
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid image file'
      };
    }
  }
}

module.exports = new FreeIDVerification();

