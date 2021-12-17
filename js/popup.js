'use strict';

const UPLOAD_URL = 'https://sugarshare.redouaneachouri.com/upload';

const progressBar = document.getElementById('js-progressbar');
const countdown = document.getElementById('js-countdown');
const textzone = document.getElementById('js-textzone');
const copyClipboard = document.getElementById('js-copy-clipboard');
const openNewtab = document.getElementById('js-open-newtab');

UIkit.upload('#js-upload', {
  url: UPLOAD_URL,
  multiple: false,

  error: function (e) {
    alert(e);
  },

  loadStart: function (e) {
    progressBar.removeAttribute('hidden');
    progressBar.max = e.total;
    progressBar.value = e.loaded;
  },

  progress: function (e) {
    progressBar.max = e.total;
    progressBar.value = e.loaded;
  },

  loadEnd: function (e) {
    progressBar.max = e.total;
    progressBar.value = e.loaded;
  },

  completeAll: function (e) {
    const { url, expiryTimestampMillis } = JSON.parse(e.response);

    // Enable copy of result to clipboard
    copyClipboard.addEventListener('click', () => copyToClipboard(url, '#js-copy-clipboard'));

    // Enable opening result URL in new tab
    openNewtab.setAttribute('href', url);

    // Display URL
    textzone.removeAttribute('hidden');
    textzone.setAttribute('value', url);

    countdown.removeAttribute('hidden');
    countdown.setAttribute('uk-countdown', `date: ${new Date(expiryTimestampMillis)}`);

    setTimeout(function () {
        progressBar.setAttribute('hidden', 'hidden');
    }, 1000);
  }
});

const copyToClipboard = (text, tooltipElement) => {
  navigator.permissions.query({name: 'clipboard-write'}).then(result => {
    if (result.state == 'granted' || result.state == 'prompt') {
      navigator.clipboard.writeText(text)
        .then(() => {
          if (tooltipElement) {
            // UIkit.tooltip(tooltipElement).hide();
            // UIkit.tooltip(tooltipElement, { title: 'Copied!' });
            // UIkit.tooltip(tooltipElement).show();
          }
        })
        .catch((error) => alert(`Failed to write to clipboard!: ${error}`));
    } else {
      alert('Missing authorization to write to the clipboard!');
    }
  });
};