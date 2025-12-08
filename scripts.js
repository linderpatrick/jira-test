document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('template-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // HTML5 validation
    if (!form.reportValidity()) {
      return;
    }

    // Values from the form
    const startDate = form.elements['startDate'].value;
    const wireframeDays = Number(form.elements['wireframeDays'].value);
    const htmlDays = Number(form.elements['htmlDays'].value);
    const cssDays = Number(form.elements['cssDays'].value);
    const jsDays = Number(form.elements['jsDays'].value);

    // Use the issue that the panel is shown on (so you don't hard-code WEB-92)
    const issueKey = AdaptavistBridgeContext.context.issueKey || 'WEB-92';

    // TODO: replace with your real customfield IDs
    const FIELD_PROJECT_START_DATE = 'ProjectStartDate';
    const FIELD_WIREFRAME_DAYS    = 'WireFrameDuration';
    const FIELD_HTML_DAYS         = 'HtmlDuration';
    const FIELD_CSS_DAYS          = 'CssDuration';
    const FIELD_JS_DAYS           = 'JsDuration';
    const FIELD_TRIGGER           = 'Trigger'; // checkbox

    const body = {
      fields: {
        [FIELD_PROJECT_START_DATE]: startDate,
        [FIELD_WIREFRAME_DAYS]: wireframeDays,
        [FIELD_HTML_DAYS]: htmlDays,
        [FIELD_CSS_DAYS]: cssDays,
        [FIELD_JS_DAYS]: jsDays,
        [FIELD_TRIGGER]: true           // this is what your listener watches
      }
    };

    try {
      await AdaptavistBridge.request({
        url: `/rest/api/3/issue/${issueKey}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body)
      });

      alert('Website template request submitted. The tasks will be created shortly.');
    } catch (e) {
      console.error('Failed to update issue', e);
      alert('Could not send data to Jira. Check the browser console for details.');
    }
  });
});