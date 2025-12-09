// script.js
(function () {
  console.log('script.js loaded, document.readyState =', document.readyState);

  function initForm() {
    const form = document.getElementById('template-form');
    if (!form) {
      console.warn('template-form not found in DOM');
      return;
    }

    console.log('template-form found, attaching submit handler');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('submit handler fired');

      // HTML5 validation
      if (!form.reportValidity()) {
        console.log('form is invalid, aborting');
        return;
      }

      // Values from the form
      const startDate = form.elements['startDate'].value;
      const wireframeDays = Number(form.elements['wireframeDays'].value);
      const htmlDays = Number(form.elements['htmlDays'].value);
      const cssDays = Number(form.elements['cssDays'].value);
      const jsDays = Number(form.elements['jsDays'].value);

      console.log('Form values:', {
        startDate,
        wireframeDays,
        htmlDays,
        cssDays,
        jsDays,
      });

      // Use the issue that the panel is shown on (fallback for testing)
      const issueKey =
        (window.AdaptavistBridgeContext &&
          AdaptavistBridgeContext.context &&
          AdaptavistBridgeContext.context.issueKey) ||
        'WEB-92';

      console.log('Using issueKey:', issueKey);

      // ❗️IMPORTANT: these must be the real field IDs like "customfield_12345"
      const FIELD_PROJECT_START_DATE = 'ProjectStartDate'; // ProjectStartDate
      const FIELD_WIREFRAME_DAYS = 'WireFrameDuration';     // WireFrameDuration
      const FIELD_HTML_DAYS = 'HtmlDuration';          // HtmlDuration
      const FIELD_CSS_DAYS = 'CssDuration';           // CssDuration
      const FIELD_JS_DAYS = 'JsDuration';            // JsDuration
      const FIELD_TRIGGER = 'Trigger';            // Trigger (checkbox)

      const body = {
        fields: {
          [FIELD_PROJECT_START_DATE]: startDate,   // "YYYY-MM-DD"
          [FIELD_WIREFRAME_DAYS]: wireframeDays,
          [FIELD_HTML_DAYS]: htmlDays,
          [FIELD_CSS_DAYS]: cssDays,
          [FIELD_JS_DAYS]: jsDays,
          [FIELD_TRIGGER]: true,
        },
      };

      console.log('Request body:', body);

      try {
        const response = await AdaptavistBridge.request({
          url: `/rest/api/3/issue/${issueKey}`,
          type: 'PUT', // if this ever fails, try `method: 'PUT'` instead
          contentType: 'application/json',
          data: JSON.stringify(body),
        });

        console.log('Update response:', response);
        alert(
          'Website template request submitted. The tasks will be created shortly.'
        );
      } catch (e) {
        console.error('Failed to update issue', e);
        alert(
          'Could not send data to Jira. Open the browser console (F12) and check the error.'
        );
      }
    });
  }

  // Run initForm whether or not DOMContentLoaded already happened
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();

