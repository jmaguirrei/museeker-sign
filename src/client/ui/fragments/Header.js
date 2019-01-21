

export const Header = client => {

  const size = client.lib.Sizes.HEADER_HEIGHT;
  const { Progress } = client.ui.components;

  return client.hoc({

    actions(props, store) {
      return {
        onNavigateBack: () => store.call('changeRoute', { page: '', action: 'back' }),
      };
    },

    classes: {
      container: `
        min-height: ${size};
        max-height: ${size};
        display: flex;
        align-items: center;
        padding: 0 25px;
        border-bottom: 1px solid hsl(0, 0%, 95%);
      `,
      image: `
        max-height: 32px;
      `,
    },

    styles: {
      container: numSteps => `
        justify-content: ${numSteps > 0 ? 'space-between' : 'center'};
      `,

    },

    render({ props, classes, styles }) {

      const { numSteps = 0, currentStep } = props;
      const src = client.lib.Assets.COMPANY_LOGO;

      return client.html`
        <header
          class=${classes.container}
          style=${styles.container(numSteps)}
        >
          <img src=${src} alt='company-name' class=${classes.image} />
          ${numSteps > 0 ? Progress({ numSteps, currentStep }) : ''}
        </header>
      `;
    }

  });

};
