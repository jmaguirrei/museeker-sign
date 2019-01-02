
import _ from '@jmaguirrei/belt';

export const Progress = ui => {

  return ui.hoc({

    styles: {
      container: `
        display: flex;
        justify-content: center;
        margin-top: 8px;
      `,
      item: isSelected => `
        background: ${isSelected ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 90%)'};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin: 0 5px;
      `,
    },

    render({ props, styles }) {

      const { numSteps, currentStep } = props;

      return ui.html`
        <div id='progress' style=${styles.container}>
          ${_.range(numSteps).map(item => {
            const isSelected = item === currentStep;
            return ui.html`
              <div style=${styles.item(isSelected)}></div>
            `;
          })}
        </div>
      `;
    }

  });

};
