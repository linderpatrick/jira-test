(function () {
  console.log('[WebPanel] script loaded, readyState =', document.readyState);
  console.log('[WebPanel] AdaptavistBridge exists:', !!window.AdaptavistBridge);
  console.log('[WebPanel] AdaptavistBridgeContext:', window.AdaptavistBridgeContext);

  function initForm() {
    const form = document.getElementById('template-form');
    if (!form) {
      console.warn('[WebPanel] template-form not found in DOM');
      return;
    }

    console.log('[WebPanel] template-form found, attaching submit handler');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('[WebPanel] submit handler fired');

      if (!form.reportValidity()) {
        console.log('[WebPanel] form invalid, aborting');
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
        alert('Cannot talk to Jira (AdaptavistBridge not available).');
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



      // 👇 If Trigger is a *Checkbox* custom field with option "Trigger", for example:
       const triggerValue = [{ value: 'OK' }];

      const body = {
        fields: {
          [FIELD_PROJECT_START_DATE]: startDate,   // "YYYY-MM-DD"
          [FIELD_WIREFRAME_DAYS]:     wireframeDays,
          [FIELD_HTML_DAYS]:          htmlDays,
          [FIELD_CSS_DAYS]:           cssDays,
          [FIELD_JS_DAYS]:            jsDays,
          [FIELD_TRIGGER]:            triggerValue
        }
      };

      console.log('[WebPanel] Request body:', body);

      try {
        const response = await AdaptavistBridge.request({
          // Docs examples use /rest/api/2 - stick with that
          url: `/rest/api/2/issue/${issueKey}`,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(body)
        });

        console.log('[WebPanel] Update response:', response);
        alert('Fields updated in Jira. The listener should run shortly.');

        // Optional: clear the form so you see it "submitted"
        form.reset();
      } catch (e) {
        console.error('[WebPanel] Failed to update issue:', e);
        alert('Error updating Jira. Open DevTools → Console for details.');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();

