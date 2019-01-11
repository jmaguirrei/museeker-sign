
export const Token = ui => {

  return ui.hoc({

    classes: {
      container: `
        display: flex;
        margin: 10px 20px;
        justify-content: space-between;
      `,
      digit: `
        font-size: 34px;
        flex: 1;
        height: 50px;
        line-height:50px;
        text-align: center;
        max-width: 50px;
        background: hsl(0, 0%, 95%);
        border: 1px solid hsl(0,0%,90%);
        border-radius: 5px;
        user-select: none;
      `,
    },

    render({ props, classes }) {

      const { tokenDigits } = props;
      const range = [ 0, 1, 2, 3, 4, 5 ];

      return ui.html`
        <div id='token' class=${classes.container}>
          ${range.map(i => {
            return ui.html`
              <div class=${classes.digit}>
                ${tokenDigits[i] || ''}
              </div>
            `;
          })}
        </div>
      `;
    }

  });

};

