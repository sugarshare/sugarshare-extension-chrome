'use strict';

const API_URL = 'https://api.sugarshare.me';

const selectSection = document.getElementById('js-select-section');
const resultSection = document.getElementById('js-result-section');
const progressBar = document.getElementById('js-progressbar');
const countdown = document.getElementById('js-countdown');
const textzone = document.getElementById('js-textzone');
const copyClipboard = document.getElementById('js-copy-clipboard');
const openNewtab = document.getElementById('js-open-newtab');

const fileInput = document.getElementById('js-file-input');
fileInput.addEventListener('change', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const file = event.target.files[0];

  try {
    const res = await initUpload(file);

    const { presignedUrl } = res;
    await uploadFile(presignedUrl, file);
  } catch (error) {
    alert(`Error while trying to initiate upload: ${error}`);
  }
});

async function initUpload(file) {
  const data = {
    title: file.name,
    fileType: file.type,
    sizeBytes: file.size,
  };

  const response = await fetch(
    `${API_URL}/init`,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      // credentials: 'include'
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      // referrerPolicy
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status}: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function uploadFile(presignedUrl, file) {

  const config = {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      alert(`${progressEvent.loaded} / ${progressEvent.total}`);
    },
  };

  axios.put(presignedUrl, file, config)
    .then(res => {
      const url = new URL(presignedUrl);
      alert(`sugarshare.me${url.pathname}`);
    })
    .catch(error => alert(error.message));

}

// UIkit.upload('#js-upload', {
//   url: presignedUrl,
//   method: 'PUT',
//   type: 'PUT',
//   multiple: false,

//   error: function (error) {
//     toggleDisplay(progressBar);
//     // TODO: display error section here and hide (or not?? so that users can reselect) select section

//     const { xhr, status } = error;

//     if (status === 413) {
//       alert(`Ouch... This file exceeds the maximum supported size of ${MAX_FILE_SIZE_MB} MB 🙈`);
//     } else {
//       alert(`An error occurred, please try again.`);
//     }
//   },

//   loadStart: function (e) {
//     toggleDisplay(progressBar);
//     progressBar.max = e.total;
//     progressBar.value = e.loaded;
//   },

//   progress: function (e) {
//     progressBar.max = e.total;
//     progressBar.value = e.loaded;
//   },

//   loadEnd: function (e) {
//     progressBar.max = e.total;
//     progressBar.value = e.loaded;
//   },

//   completeAll: function (e) {
//     const res = JSON.parse(e.response);
//     alert(res);

//     // // Enable copy of result to clipboard
//     // copyClipboard.addEventListener('click', () => copyToClipboard(url, '#js-copy-clipboard'));

//     // // Enable opening result URL in new tab
//     // openNewtab.setAttribute('href', url);

//     // // Display URL
//     // textzone.setAttribute('value', url);

//     // // Start countdown
//     // countdown.setAttribute('uk-countdown', `date: ${new Date(expiryTimestampMillis)}`);

//     setTimeout(function () {
//       toggleDisplay(selectSection);
//       toggleDisplay(resultSection);
//     }, 200);
//   }
// });

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