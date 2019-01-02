
const backspace = `
  <svg viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z"/>
  </svg>
`;

const eyeOn = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z">
    </path>
  </svg>
`;

const eyeOff = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z">
    </path>
  </svg>
`;

const email = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z">
    </path>
  </svg>
`;

const close = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z">
    </path>
  </svg>
`;

const chevronLeft = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z">
    </path>
  </svg>
`;

const chevronRight = `
  <svg viewbox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none">
    </path>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z">
    </path>
  </svg>
`;

const linkedin = `
  <svg viewbox="0 0 24 24">
    <path fill="#0077B5" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z">
    </path>
  </svg>
`;

const google = `
  <svg viewBox="0 0 48 48">
    <defs>
      <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
    </defs>
    <clipPath id="b">
      <use xlink:href="#a" overflow="visible"/>
    </clipPath>
    <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/>
    <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
    <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
    <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
  </svg>
`;

const facebook = `
  <svg viewbox="0 0 24 24">
    <path fill="#3B5998" d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0">
    </path>
  </svg>
`;

/* --------------------------------------------------------------------------------------------- */

export const IconsSVGs = {

  // Keyboard
  backspace,

  // Forms
  'eye-on': eyeOn,
  'eye-off': eyeOff,
  email,

  // Navigation
  close,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,

  // Social
  facebook,
  linkedin,
  google,

};
