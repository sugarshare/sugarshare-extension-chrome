'use strict';

const UPLOAD_URL = 'https://sugarshare.redouaneachouri.com/upload';
const MAX_FILE_SIZE_MB = 10;

const selectSection = document.getElementById('js-select-section');
const resultSection = document.getElementById('js-result-section');
const progressBar = document.getElementById('js-progressbar');
const countdown = document.getElementById('js-countdown');
const textzone = document.getElementById('js-textzone');
const copyClipboard = document.getElementById('js-copy-clipboard');
const openNewtab = document.getElementById('js-open-newtab');

UIkit.upload('#js-upload', {
  url: UPLOAD_URL,
  multiple: false,

  error: function (error) {
    toggleDisplay(progressBar);
    // TODO: display error section here and hide (or not?? so that users can reselect) select section

    const { xhr, status } = error;

    if (status === 413) {
      alert(`Ouch... This file exceeds the maximum supported size of ${MAX_FILE_SIZE_MB} MB 🙈`);
    } else {
      alert(`An error occurred, please try again.`);
    }
  },

  loadStart: function (e) {
    toggleDisplay(progressBar);
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
    textzone.setAttribute('value', url);

    // Start countdown
    countdown.setAttribute('uk-countdown', `date: ${new Date(expiryTimestampMillis)}`);

    setTimeout(function () {
      toggleDisplay(selectSection);
      toggleDisplay(resultSection);
    }, 200);
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

const toggleDisplay = (element) => {
  element.style.display = element.style.display === 'none'
    ? 'block'
    : 'none';
}

function debug (text) {
  document.getElementById('debugging').value += '\n' + text;
}