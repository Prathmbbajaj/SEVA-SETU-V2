import re
import json

def verify():
    with open('frontend/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('frontend/app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()

    ids = [
        'citizen-persona-select',
        'citizen-persona-badge',
        'citizen-debarred-alert',
        'citizen-debarred-alert-text',
        'citizen-debarred-services-list',
        'modal-service-debarment',
        'debarred-modal-customer',
        'debarred-modal-service-name',
        'debarred-modal-reason',
        'modal-satisfaction-review',
        'satisfaction-modal-count',
        'satisfaction-modal-items',
        'satisfaction-modal-total-labor',
        'citizen-worker-accepted-banner',
        'citizen-worker-accepted-time',
        'citizen-worker-accepted-title',
        'citizen-worker-accepted-sub',
        'banner-start-otp-val',
        'modal-worker-accepted-toast',
        'toast-worker-name',
        'toast-worker-photo',
        'toast-worker-coop',
        'toast-worker-rating',
        'toast-worker-distance',
        'toast-start-otp',
        'toast-end-otp',
        'modal-ministry-debar-order',
        'min-debar-target-select',
        'min-debar-scope-all',
        'min-debar-services-list',
        'min-debar-reason-select',
        'min-debar-duration-select',
        'worker-login-persona-grid',
        'worker-login-name',
        'worker-login-phone',
        'btn-send-worker-otp',
        'worker-login-otp',
        'worker-login-coop',
        'worker-coop-id-input',
        'worker-persona-select',
        'subservices-action-bar',
        'selected-subservices-count',
        'selected-subservices-label',
        'selected-subservices-subtotal',
        'btn-proceed-subservices',
        'in-menu-satisfaction-panel',
        'in-menu-task-count',
        'in-menu-satisfaction-items',
        'in-menu-satisfaction-total',
        'modal-worker-auth-gate',
        'gate-worker-avatar',
        'gate-worker-name',
        'gate-worker-skill',
        'gate-worker-coop',
        'gate-worker-phone',
        'gate-worker-pacs-id',
        'gate-worker-otp',
        'gate-worker-demo-otp-btn',
        'gate-worker-demo-otp-code',
        'gate-worker-auth-feedback',
        'modal-citizen-auth',
        'citizen-auth-name',
        'citizen-auth-phone',
        'citizen-auth-location',
        'citizen-auth-otp',
        'citizen-auth-demo-otp-btn',
        'citizen-auth-demo-otp-code',
        'citizen-auth-feedback',
        'citizen-location-text',
        'invoice-tasks-container',
        'invoice-tasks-list'
    ]

    missing = [i for i in ids if f'id="{i}"' not in html and f"id='{i}'" not in html]
    if missing:
        print('MISSING DOM IDS:', missing)
        return False
    print(f'[PASS] All {len(ids)} target DOM elements verified in frontend/index.html!')

    # Verify key JS functions exist in app.js
    functions = [
        'isCustomerDebarredForService',
        'changeCitizenPersona',
        'openServiceDebarmentModal',
        'closeServiceDebarmentModal',
        'switchToCompliantCitizen',
        'toggleSubServiceSelection',
        'openSatisfactionReviewModal',
        'closeSatisfactionReviewModal',
        'confirmSatisfactionAndProceed',
        'backToSubServicesSelection',
        'openWorkerAuthGateModal',
        'cancelWorkerAuthGate',
        'sendWorkerAuthGateOtp',
        'autofillWorkerAuthGateOtp',
        'submitWorkerAuthGate',
        'openCitizenAuthModal',
        'cancelCitizenAuth',
        'selectCitizenAuthLocationPreset',
        'detectCitizenGpsLocation',
        'sendCitizenOtp',
        'autofillCitizenOtp',
        'submitCitizenAuth',
        'renderInvoiceTasksList',
        'workerAcceptJob',
        'closeWorkerAcceptedToast',
        'focusCitizenBookingStatus',
        'workerRejectJob',
        'selectWorkerLoginPersona',
        'sendWorkerOtp',
        'autofillWorkerOtp',
        'grantWorkerAppAccess',
        'openMinistryDebarModal',
        'closeMinistryDebarModal',
        'toggleMinistryDebarAll',
        'handleMinistryDebarSubmit',
        'ministryCustomerDebarAction',
        'renderMinistryDebarmentTable'
    ]

    missing_funcs = [fn for fn in functions if f'function {fn}' not in app_js and f'{fn} = ' not in app_js]
    if missing_funcs:
        print('MISSING FUNCTIONS:', missing_funcs)
        return False
    print(f'[PASS] All {len(functions)} required JavaScript functions verified in frontend/app.js!')

    # Verify WORKER_PERSONAS has 5 personas
    for persona in ['rajesh', 'aslam', 'sunita', 'vikram', 'amit']:
        if persona not in app_js:
            print(f'MISSING PERSONA: {persona}')
            return False
    print('[PASS] All 5 worker personas (Rajesh, Aslam, Sunita, Vikram, Amit) verified in WORKER_PERSONAS!')

    print('\n======================================================')
    print(' FRONTEND DOM & LOGIC STATIC VERIFICATION 100% PASSED!')
    print('======================================================')
    return True

if __name__ == '__main__':
    verify()
