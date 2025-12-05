(function () {
  const STORAGE_KEY = 'vvelUniverseAppState.v1';
  const MAX_TRANSACTIONS = 60;
  const MAX_NOTIFICATIONS = 50;
  const MAX_JOIN_REQUESTS = 100;

  const defaultState = {
    wallet: {
      balance: 2450,
      transactions: [
        {
          id: 'txn-1',
          type: 'debit',
          title: 'Connection Payment',
          subtitle: 'Pastor John • 1:1 (15 min)',
          amount: 150,
          date: '2 hours ago',
          status: 'completed'
        },
        {
          id: 'txn-2',
          type: 'debit',
          title: 'Live Event Entry',
          subtitle: 'Gospel Worship Concert',
          amount: 200,
          date: '1 day ago',
          status: 'completed'
        },
        {
          id: 'txn-3',
          type: 'credit',
          title: 'Money Added',
          subtitle: 'UPI Payment',
          amount: 1000,
          date: '2 days ago',
          status: 'completed'
        },
        {
          id: 'txn-4',
          type: 'debit',
          title: 'Connection Payment',
          subtitle: 'Rev. Sarah • 1:5 (10 min)',
          amount: 100,
          date: '3 days ago',
          status: 'completed'
        }
      ],
      autopayEnabled: true,
      connectionAutopay: true,
      notifyBeforePayment: true,
      maxAutopayLimit: 500
    },
    notifications: [],
    sessions: {},
    joinRequests: [],
    adminOverrides: []
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function ensureArray(value, fallback) {
    return Array.isArray(value) ? value : fallback;
  }

  function ensureObject(value, fallback) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  }

  function normalizeState(raw) {
    const state = ensureObject(raw, {});
    state.wallet = ensureObject(state.wallet, {});
    state.wallet.balance = Number.isFinite(state.wallet.balance) ? Number(state.wallet.balance) : defaultState.wallet.balance;
    state.wallet.transactions = ensureArray(state.wallet.transactions, defaultState.wallet.transactions).slice(0, MAX_TRANSACTIONS);
    state.wallet.autopayEnabled = state.wallet.autopayEnabled !== undefined ? !!state.wallet.autopayEnabled : defaultState.wallet.autopayEnabled;
    state.wallet.connectionAutopay = state.wallet.connectionAutopay !== undefined ? !!state.wallet.connectionAutopay : defaultState.wallet.connectionAutopay;
    state.wallet.notifyBeforePayment = state.wallet.notifyBeforePayment !== undefined ? !!state.wallet.notifyBeforePayment : defaultState.wallet.notifyBeforePayment;
    const limit = Number(state.wallet.maxAutopayLimit);
    state.wallet.maxAutopayLimit = Number.isFinite(limit) && limit > 0 ? limit : defaultState.wallet.maxAutopayLimit;

    state.notifications = ensureArray(state.notifications, defaultState.notifications).slice(0, MAX_NOTIFICATIONS);
    state.sessions = ensureObject(state.sessions, defaultState.sessions);
    state.joinRequests = ensureArray(state.joinRequests, defaultState.joinRequests)
      .slice(0, MAX_JOIN_REQUESTS)
      .map(request => {
        const normalizedRequest = ensureObject(request, {});
        normalizedRequest.id = normalizedRequest.id || generateId('req');
        normalizedRequest.sessionId = normalizedRequest.sessionId !== undefined
          ? String(normalizedRequest.sessionId)
          : generateId('session');
        normalizedRequest.status = normalizedRequest.status || 'pending';
        normalizedRequest.createdAt = normalizedRequest.createdAt || Date.now();
        normalizedRequest.updatedAt = normalizedRequest.updatedAt || normalizedRequest.createdAt;
        normalizedRequest.amount = Number.isFinite(Number(normalizedRequest.amount))
          ? Number(normalizedRequest.amount)
          : 0;
        normalizedRequest.durationMinutes = Number.isFinite(Number(normalizedRequest.durationMinutes))
          ? Number(normalizedRequest.durationMinutes)
          : 30;
        return normalizedRequest;
      });
    state.adminOverrides = ensureArray(state.adminOverrides, defaultState.adminOverrides);

    return state;
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const initial = clone(defaultState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(stored);
      const normalized = normalizeState(parsed);
      return mergeDefaults(normalized, defaultState);
    } catch (error) {
      console.warn('Unable to load app state, resetting.', error);
      const fallback = clone(defaultState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }

  function mergeDefaults(state, defaults) {
    const merged = clone(defaults);
    merged.wallet = Object.assign({}, defaults.wallet, state.wallet);
    merged.wallet.transactions = ensureArray(state.wallet?.transactions, defaults.wallet.transactions);
    merged.notifications = ensureArray(state.notifications, defaults.notifications);
    merged.sessions = Object.assign({}, defaults.sessions, ensureObject(state.sessions, defaults.sessions));
    merged.joinRequests = ensureArray(state.joinRequests, defaults.joinRequests);
    merged.adminOverrides = ensureArray(state.adminOverrides, defaults.adminOverrides);
    return merged;
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getState() {
    return clone(loadState());
  }

  function updateState(mutator) {
    const current = loadState();
    const draft = clone(current);
    mutator(draft);
    const normalized = normalizeState(draft);
    saveState(normalized);
    return clone(normalized);
  }

  function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }

  function formatDateRelative(timestamp) {
    const now = Date.now();
    const diffMs = timestamp - now;
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const ranges = [
      { limit: 60_000, divisor: 1000, unit: 'second' },
      { limit: 3_600_000, divisor: 60_000, unit: 'minute' },
      { limit: 86_400_000, divisor: 3_600_000, unit: 'hour' },
      { limit: 604_800_000, divisor: 86_400_000, unit: 'day' },
      { limit: 2_592_000_000, divisor: 604_800_000, unit: 'week' },
      { limit: 31_536_000_000, divisor: 2_592_000_000, unit: 'month' }
    ];

    let unit = 'year';
    let divisor = 31_536_000_000;
    const absDiff = Math.abs(diffMs);

    for (const range of ranges) {
      if (absDiff < range.limit) {
        unit = range.unit;
        divisor = range.divisor;
        break;
      }
    }

    return rtf.format(Math.round(diffMs / divisor), unit);
  }

  function addNotificationInternal(state, notification) {
    const entry = Object.assign(
      {
        id: generateId('ntf'),
        unread: true,
        createdAt: Date.now(),
        type: 'system',
        title: 'Notification',
        message: '',
        icon: 'system'
      },
      notification
    );

    state.notifications.unshift(entry);
    if (state.notifications.length > MAX_NOTIFICATIONS) {
      state.notifications.length = MAX_NOTIFICATIONS;
    }
    return entry;
  }

  function addTransactionInternal(state, transaction) {
    const entry = Object.assign(
      {
        id: generateId('txn'),
        type: 'debit',
        title: 'Transaction',
        subtitle: '',
        amount: 0,
        date: 'Just now',
        status: 'completed'
      },
      transaction
    );

    state.wallet.transactions.unshift(entry);
    if (state.wallet.transactions.length > MAX_TRANSACTIONS) {
      state.wallet.transactions.length = MAX_TRANSACTIONS;
    }
    return entry;
  }

  function locateJoinRequest(state, payload) {
    if (!Array.isArray(state.joinRequests)) {
      return null;
    }
    const requestId = payload?.requestId ? String(payload.requestId) : null;
    const sessionKey = payload?.sessionId !== undefined ? String(payload.sessionId) : null;
    return state.joinRequests.find(request => {
      if (requestId && request.id === requestId) {
        return true;
      }
      if (sessionKey && request.sessionId === sessionKey && request.status !== 'rejected') {
        return true;
      }
      return false;
    }) || null;
  }

  function generateMeetingDetails(payload) {
    const scheduledStart = payload?.scheduledStart
      ? new Date(payload.scheduledStart)
      : new Date(Date.now() + 10 * 60 * 1000);
    const durationMinutes = payload?.durationMinutes || 30;
    const meetingCode = (payload?.hostName || 'VVEL')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, 'X')
      .concat('-', Math.random().toString(36).substring(2, 6).toUpperCase());

    return {
      sessionId: String(payload.sessionId),
      hostName: payload.hostName,
      sessionTitle: payload.sessionTitle,
      scheduledStart: scheduledStart.toISOString(),
      scheduledStartDisplay: scheduledStart.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }),
      startsIn: formatDateRelative(scheduledStart.getTime()),
      durationMinutes,
      meetingCode,
      joinUrl: `call-room.html?sessionId=${encodeURIComponent(payload.sessionId)}`,
      supportAudio: true,
      supportVideo: true
    };
  }

  function processConnectionApproval(payload) {
    let outcome = {
      status: 'pending',
      reason: null,
      meetingDetails: null
    };

    updateState(state => {
      const wallet = state.wallet;
      const sessionKey = String(payload.sessionId);
      const request = locateJoinRequest(state, payload);
      const decisionBy = payload?.approvedBy || payload?.adminEmail || 'admin';

      if (!wallet.autopayEnabled || !wallet.connectionAutopay) {
        outcome = {
          status: 'autopay_disabled',
          reason: 'Autopay is turned off. Complete payment manually.',
          meetingDetails: null
        };
        addNotificationInternal(state, {
          type: 'connection',
          icon: 'connection',
          title: `${payload.hostName} approved your request`,
          message: `Complete the payment of ₹${payload.amount.toFixed(2)} to join "${payload.sessionTitle}".`,
          sessionId: sessionKey
        });
        if (request) {
          request.status = 'needs_payment';
          request.updatedAt = Date.now();
          request.reason = outcome.reason;
          request.decisionBy = decisionBy;
          request.notes = payload?.notes || request.notes || null;
        }
        return;
      }

      if (payload.amount > wallet.maxAutopayLimit) {
        outcome = {
          status: 'limit_exceeded',
          reason: `Requested amount exceeds your auto-pay limit of ₹${wallet.maxAutopayLimit.toFixed(2)}.`,
          meetingDetails: null
        };
        addNotificationInternal(state, {
          type: 'connection',
          icon: 'connection',
          title: `${payload.hostName} confirmed your session`,
          message: `The fee ₹${payload.amount.toFixed(2)} is above your auto-pay limit. Review and pay manually.`,
          sessionId: sessionKey
        });
        if (request) {
          request.status = 'needs_payment';
          request.updatedAt = Date.now();
          request.reason = outcome.reason;
          request.decisionBy = decisionBy;
          request.notes = payload?.notes || request.notes || null;
        }
        return;
      }

      if (wallet.balance < payload.amount) {
        outcome = {
          status: 'insufficient_balance',
          reason: 'Insufficient wallet balance. Please add funds.',
          meetingDetails: null
        };
        addNotificationInternal(state, {
          type: 'system',
          icon: 'alert-triangle',
          title: 'Payment blocked',
          message: `Auto-payment of ₹${payload.amount.toFixed(2)} to join "${payload.sessionTitle}" failed due to low balance.`,
          sessionId: sessionKey
        });
        if (request) {
          request.status = 'needs_payment';
          request.updatedAt = Date.now();
          request.reason = outcome.reason;
          request.decisionBy = decisionBy;
          request.notes = payload?.notes || request.notes || null;
        }
        return;
      }

      wallet.balance -= payload.amount;
      addTransactionInternal(state, {
        type: 'debit',
        title: 'Connection Payment',
        subtitle: `${payload.hostName} • ${payload.sessionTitle}`,
        amount: payload.amount,
        date: 'Just now',
        status: 'completed'
      });

      const meetingDetails = generateMeetingDetails(payload);
      state.sessions[sessionKey] = Object.assign({}, state.sessions[sessionKey], {
        sessionId: sessionKey,
        status: 'confirmed',
        hostName: payload.hostName,
        sessionTitle: payload.sessionTitle,
        amount: payload.amount,
        meetingDetails,
        updatedAt: Date.now()
      });

      addNotificationInternal(state, {
        type: 'connection',
        icon: 'video',
        title: `${payload.hostName} confirmed your session`,
        message: `You are all set for "${payload.sessionTitle}". Starts ${meetingDetails.startsIn}. Meeting code: ${meetingDetails.meetingCode}.`,
        sessionId: sessionKey,
        meetingDetails
      });

      if (request) {
        request.status = 'approved';
        request.updatedAt = Date.now();
        request.reason = null;
        request.decisionBy = decisionBy;
        request.notes = payload?.notes || request.notes || null;
        request.meetingDetails = meetingDetails;
        request.outcome = 'auto_paid';
      }

      outcome = {
        status: 'auto_paid',
        reason: null,
        meetingDetails
      };
    });

    return outcome;
  }

  function recordManualConnectionPayment(payload) {
    let outcome = {
      status: 'recorded',
      meetingDetails: null
    };

    updateState(state => {
      const meetingDetails = generateMeetingDetails(payload);
      state.sessions[String(payload.sessionId)] = Object.assign({}, state.sessions[String(payload.sessionId)], {
        sessionId: String(payload.sessionId),
        status: 'confirmed',
        hostName: payload.hostName,
        sessionTitle: payload.sessionTitle,
        amount: payload.amount,
        meetingDetails,
        updatedAt: Date.now()
      });

      const request = locateJoinRequest(state, payload);
      if (request) {
        request.status = 'approved';
        request.updatedAt = Date.now();
        request.reason = null;
        request.decisionBy = payload?.processedBy || payload?.adminEmail || 'manual';
        request.notes = payload?.notes || request.notes || null;
        request.meetingDetails = meetingDetails;
        request.outcome = 'manual_payment';
      }

      addNotificationInternal(state, {
        type: 'connection',
        icon: 'video',
        title: `Session confirmed: ${payload.sessionTitle}`,
        message: `Your payment via ${payload.paymentMethod || 'manual method'} was successful. Meeting code: ${meetingDetails.meetingCode}.`,
        sessionId: String(payload.sessionId),
        meetingDetails
      });

      outcome = {
        status: 'recorded',
        meetingDetails
      };
    });

    return outcome;
  }

  function createJoinRequest(payload) {
    if (!payload || payload.sessionId === undefined) {
      return null;
    }
    let created = null;
    updateState(state => {
      const request = {
        id: generateId('req'),
        sessionId: String(payload.sessionId),
        hostId: payload.hostId || null,
        hostName: payload.hostName || 'Community Host',
        hostAvatar: payload.hostAvatar || '👤',
        sessionTitle: payload.sessionTitle || 'Community Session',
        amount: Number(payload.amount) || 0,
        message: payload.message ? String(payload.message).trim() : '',
        userId: payload.userId || 'local-user',
        userName: payload.userName || 'You',
        userEmail: payload.userEmail || null,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        preferredStart: payload.preferredStart || null,
        durationMinutes: payload.durationMinutes || 30,
        notes: null,
        outcome: null
      };
      state.joinRequests.unshift(request);
      if (state.joinRequests.length > MAX_JOIN_REQUESTS) {
        state.joinRequests.length = MAX_JOIN_REQUESTS;
      }
      created = clone(request);
      addNotificationInternal(state, {
        type: 'connection',
        icon: 'inbox',
        title: `Request sent to ${request.hostName}`,
        message: `Waiting for approval to join "${request.sessionTitle}".`,
        sessionId: request.sessionId
      });
    });
    return created;
  }

  function getJoinRequest(requestId) {
    if (!requestId) {
      return null;
    }
    const state = getState();
    return ensureArray(state.joinRequests, []).find(request => request.id === requestId) || null;
  }

  function getJoinRequests(filter = {}) {
    const state = getState();
    let list = ensureArray(state.joinRequests, []);
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      list = list.filter(request => statuses.includes(request.status));
    }
    if (filter.userId) {
      list = list.filter(request => request.userId === filter.userId);
    }
    if (filter.sessionId !== undefined) {
      const sessionKey = String(filter.sessionId);
      list = list.filter(request => request.sessionId === sessionKey);
    }
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  function approveJoinRequest(requestId, options = {}) {
    const request = getJoinRequest(requestId);
    if (!request) {
      return { success: false, reason: 'not_found' };
    }

    const outcome = processConnectionApproval({
      requestId,
      sessionId: request.sessionId,
      hostName: request.hostName,
      sessionTitle: request.sessionTitle,
      amount: request.amount,
      scheduledStart: options.scheduledStart || request.preferredStart,
      durationMinutes: options.durationMinutes || request.durationMinutes,
      approvedBy: options.approvedBy || options.adminEmail || 'admin',
      notes: options.notes || null
    });

    const updated = getJoinRequest(requestId);

    return {
      success: outcome.status !== 'pending',
      status: updated ? updated.status : outcome.status,
      outcome,
      request: updated,
      meetingDetails: outcome.meetingDetails,
      reason: outcome.reason || updated?.reason || null
    };
  }

  function rejectJoinRequest(requestId, options = {}) {
    if (!requestId) {
      return { success: false, reason: 'invalid_request' };
    }
    let rejected = null;
    updateState(state => {
      const target = state.joinRequests.find(request => request.id === requestId);
      if (!target) {
        return;
      }
      target.status = 'rejected';
      target.updatedAt = Date.now();
      target.reason = options.reason || 'Request rejected';
      target.notes = options.notes || target.reason;
      target.decisionBy = options.adminEmail || 'admin';

      addNotificationInternal(state, {
        type: 'connection',
        icon: 'ban',
        title: `${target.hostName} request update`,
        message: `Your request to join "${target.sessionTitle}" was declined.${target.reason ? ` Reason: ${target.reason}` : ''}`,
        sessionId: target.sessionId
      });

      rejected = clone(target);
    });

    return rejected ? { success: true, request: rejected } : { success: false, reason: 'not_found' };
  }

  function getConfigAdminAccounts() {
    if (!window.vvelAdminConfig || !Array.isArray(window.vvelAdminConfig.accounts)) {
      return [];
    }
    return window.vvelAdminConfig.accounts
      .map(account => ({
        email: normalizeEmail(account.email),
        password: account.password || '',
        name: account.name || 'Administrator',
        permissions: ensureArray(account.permissions, ['all']),
        super: account.super !== undefined ? !!account.super : true
      }))
      .filter(account => account.email);
  }

  function grantAdminAccess(payload) {
    const email = normalizeEmail(payload?.email);
    const password = payload?.password;
    if (!email || !password) {
      return { success: false, reason: 'invalid_input' };
    }
    let created = null;
    updateState(state => {
      const overrides = ensureArray(state.adminOverrides, []);
      let target = overrides.find(entry => entry.email === email);
      if (target) {
        target.name = payload?.name || target.name || email;
        target.password = password;
        target.permissions = ensureArray(payload?.permissions, target.permissions || ['requests:read', 'requests:write']);
        target.updatedAt = Date.now();
        target.addedBy = payload?.addedBy || target.addedBy || 'admin';
        created = clone(target);
      } else {
        const entry = {
          id: generateId('adm'),
          email,
          name: payload?.name || email,
          password,
          permissions: ensureArray(payload?.permissions, ['requests:read', 'requests:write']),
          addedBy: payload?.addedBy || 'admin',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        overrides.push(entry);
        state.adminOverrides = overrides;
        created = clone(entry);
      }
    });
    return { success: true, admin: created };
  }

  function revokeAdminAccess(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) {
      return { success: false, reason: 'invalid_input' };
    }
    let success = false;
    updateState(state => {
      const overrides = ensureArray(state.adminOverrides, []);
      const index = overrides.findIndex(entry => normalizeEmail(entry.email) === normalized);
      if (index >= 0) {
        overrides.splice(index, 1);
        state.adminOverrides = overrides;
        success = true;
      }
    });
    return { success };
  }

  function getAdminAccounts() {
    const configAccounts = getConfigAdminAccounts().map(account => ({
      email: account.email,
      name: account.name,
      permissions: account.permissions,
      super: account.super,
      source: 'config'
    }));
    const overrides = ensureArray(getState().adminOverrides, []).map(entry => ({
      email: normalizeEmail(entry.email),
      name: entry.name || entry.email,
      permissions: ensureArray(entry.permissions, ['requests:read', 'requests:write']),
      super: false,
      addedBy: entry.addedBy || 'admin',
      createdAt: entry.createdAt,
      source: 'override'
    }));
    return configAccounts.concat(overrides);
  }

  function authenticateAdmin(email, password) {
    const normalizedEmail = normalizeEmail(email);
    const inputPassword = password || '';
    if (!normalizedEmail || !inputPassword) {
      return { success: false, reason: 'missing_credentials' };
    }

    const configAccounts = getConfigAdminAccounts();
    const configMatch = configAccounts.find(account => account.email === normalizedEmail);
    if (configMatch) {
      if (configMatch.password === inputPassword) {
        return {
          success: true,
          account: {
            email: configMatch.email,
            name: configMatch.name,
            permissions: configMatch.permissions,
            super: true,
            source: 'config'
          }
        };
      }
      return { success: false, reason: 'invalid_password' };
    }

    const overrides = ensureArray(getState().adminOverrides, []);
    const overrideMatch = overrides.find(account => normalizeEmail(account.email) === normalizedEmail);
    if (overrideMatch) {
      if (overrideMatch.password === inputPassword) {
        return {
          success: true,
          account: {
            email: normalizeEmail(overrideMatch.email),
            name: overrideMatch.name || overrideMatch.email,
            permissions: ensureArray(overrideMatch.permissions, ['requests:read', 'requests:write']),
            super: false,
            grantedBy: overrideMatch.addedBy || 'admin',
            createdAt: overrideMatch.createdAt,
            source: 'override'
          }
        };
      }
      return { success: false, reason: 'invalid_password' };
    }

    return { success: false, reason: 'not_found' };
  }

  function updateWalletBalance(delta, transaction) {
    return updateState(state => {
      state.wallet.balance = Math.max(0, Number(state.wallet.balance) + Number(delta));
      if (transaction) {
        addTransactionInternal(state, transaction);
      }
    });
  }

  function addNotification(notification) {
    return updateState(state => {
      addNotificationInternal(state, notification);
    });
  }

  function markNotificationRead(notificationId) {
    return updateState(state => {
      const target = state.notifications.find(item => item.id === notificationId);
      if (target) {
        target.unread = false;
      }
    });
  }

  function markAllNotificationsRead() {
    return updateState(state => {
      state.notifications.forEach(item => {
        item.unread = false;
      });
    });
  }

  function clearNotifications() {
    return updateState(state => {
      state.notifications = [];
    });
  }

  function setAutopayEnabled(enabled) {
    return updateState(state => {
      state.wallet.autopayEnabled = !!enabled;
    });
  }

  function setConnectionAutopay(enabled) {
    return updateState(state => {
      state.wallet.connectionAutopay = !!enabled;
    });
  }

  function setNotifyBeforePayment(enabled) {
    return updateState(state => {
      state.wallet.notifyBeforePayment = !!enabled;
    });
  }

  function setMaxAutopayLimit(amount) {
    return updateState(state => {
      const numericAmount = Number(amount);
      if (Number.isFinite(numericAmount) && numericAmount > 0) {
        state.wallet.maxAutopayLimit = numericAmount;
      }
    });
  }

  function getSession(sessionId) {
    const state = getState();
    return state.sessions[String(sessionId)] || null;
  }

  function removeSession(sessionId) {
    return updateState(state => {
      delete state.sessions[String(sessionId)];
    });
  }

  window.vvelAppState = {
    getState,
    getWallet: () => getState().wallet,
    updateWalletBalance,
    addNotification,
    processConnectionApproval,
    recordManualConnectionPayment,
    createJoinRequest,
    getJoinRequests,
    getJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setAutopayEnabled,
    setConnectionAutopay,
    setNotifyBeforePayment,
    setMaxAutopayLimit,
    getNotifications: () => getState().notifications,
    getSession,
    removeSession,
    authenticateAdmin,
    grantAdminAccess,
    revokeAdminAccess,
    getAdminAccounts
  };
})();

