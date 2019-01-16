

const breakpoint = '768px';

export const Modal = ui => {

  return ui.hoc({

    styles: {
      subcomponent: isSelected => `
        position: absolute;
        width: 100%;
        height: 100%;
        transition: opacity .3s ease;
        opacity: ${isSelected ? 1 : 0};
        pointer-events: ${isSelected ? 'auto' : 'none'};
      `,
    },

    classes: {
      container: `
        display: flex;
        align-items: center;
        justify-content:center;
        background: hsl(0, 0%, 20%);
        position: fixed;
        top: 0; bottom: 0; left: 0; right: 0;
      `,
      modal: `
        position: relative;
        background: white;
        min-width: 500px;
        width: 40%;
        max-width: 500px;
        min-height: 90%;
        max-height: 90%;
        border-radius: 10px;
        overflow: hidden;
        @media (max-width: ${breakpoint}) {
          & {
            min-height: 100%;
            min-width: 100%;
            max-width: 100%;
            width: 100%;
            border-radius: 0;
          }
        }
      `,
    },

    render({ props, styles, classes }) {

      // return ui.html`<div>Modal</div>`;
      const { pages, currentPage } = props;

      return ui.html`
        <div class='modal ${classes.container}'>
          <div class=${classes.modal}>
            ${Object.keys(pages).map(key => {
              const component = pages[key];
              return ui.html`
                <div style=${styles.subcomponent(key === currentPage)}>
                  ${component()}
                </div>
              `;
            })}
          </div>
        </div>
      `;
    }

  });

};
