
export const Carrousel = ui => {

  return ui.hoc({

    styles: {
      container: `
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 10px 20px;
      `,
      inner: currentStep => `
        display: flex;
        transition: transform .4s ease;
        transform: translate3d(${-100 * currentStep}%, 0, 0);
      `,
      screen: `
        min-width: 100%;
        padding: 20px 20px 40px;
      `,
    },

    render({ props, styles }) {

      const { screens, currentStep } = props;

      return ui.html`
        <main class='carrousel' style=${styles.container}>
          <div style=${styles.inner(currentStep)}>
            ${screens.map(screen => ui.html`
              <div style=${styles.screen}>
                ${screen()}
              </div>
            `)}
          </div>
        </main>
      `;
    }

  });

};
