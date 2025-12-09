(function () {
  console.log('[WebPanel] script loaded, readyState =', document.readyState);
  console.log('[WebPanel] AdaptavistBridge exists:', !!window.AdaptavistBridge);
  console.log('[WebPanel] AdaptavistBridgeContext:', window.AdaptavistBridgeContext);

  function initForm() {
    const form = document.getElementById('template-form');
    const status = document.getElementById('status-message');

    if (!form) {
      console.warn('[WebPanel] template-form not found in DOM');
      return;
    }

    console.log('[WebPanel] template-form found, attaching submit handler');

    function setStatus(message, isError = false) {
      if (!status) return;
      status.textContent = message;
      status.style.color = isError ? 'red' : 'green';
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('[WebPanel] submit handler fired');

      if (!form.reportValidity()) {
        console.log('[WebPanel] form invalid, aborting');
        setStatus('Please fill out all required fields.', true);
        return;
      }

      const startDate    = form.elements['startDate'].value;
      const wireframeDays = Number(form.elements['wireframeDays'].value);
      const htmlDays      = Number(form.elements['htmlDays'].value);
      const cssDays       = Number(form.elements['cssDays'].value);
      const jsDays        = Number(form.elements['jsDays'].value);

      console.log('[WebPanel] Form values:', {
        startDate,
        wireframeDays,
        htmlDays,
        cssDays,
        jsDays
      });

      if (!window.AdaptavistBridge || !window.AdaptavistBridgeContext) {
        console.error('[WebPanel] AdaptavistBridge or context missing – are we running inside Jira?');
        setStatus('Cannot talk to Jira (AdaptavistBridge not available).', true);
        return;
      }

      const issueKey = AdaptavistBridgeContext.context.issueKey;
      console.log('[WebPanel] Using issueKey:', issueKey);

	  const FIELD_PROJECT_START_DATE = 'customfield_10206';
	  const FIELD_WIREFRAME_DAYS    = 'customfield_10201';
	  const FIELD_HTML_DAYS         = 'customfield_10202';
	  const FIELD_CSS_DAYS          = 'customfield_10203';
	  const FIELD_JS_DAYS           = 'customfield_10204';
	  const FIELD_TRIGGER           = 'customfield_10165'; // checkbox

      const triggerValue = true; // or [{ value: 'Trigger' }] if it's a checkbox

      const body = {
        fields: {
          [FIELD_PROJECT_START_DATE]: startDate,
          [FIELD_WIREFRAME_DAYS]:     wireframeDays,
          [FIELD_HTML_DAYS]:          htmlDays,
          [FIELD_CSS_DAYS]:           cssDays,
          [FIELD_JS_DAYS]:            jsDays,
          [FIELD_TRIGGER]:            triggerValue
        }
      };

      console.log('[WebPanel] Request body:', body);
      setStatus('Submitting website template request…');

      try {
        const response = await AdaptavistBridge.request({
          url: `/rest/api/2/issue/${issueKey}`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(body)
        });

        console.log('[WebPanel] Update response:', response);
        setStatus('Website template request submitted. The tasks will be created shortly.');
        form.reset();
      } catch (e) {
        console.error('[WebPanel] Failed to update issue:', e);
        setStatus('Error updating Jira. See browser console for details.', true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
