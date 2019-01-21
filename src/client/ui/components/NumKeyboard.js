

import { Icons } from './Icons';

export const NumKeyboard = client => {

  const IconsComp = Icons(client);

  return client.hoc({

    classes: {
      container: `
        padding: 20px;
      `,
      range: `
        display: flex;
        justify-content:center;
      `,
      digitspan: `
        user-select: none;
      `,
    },

    styles: {
      digit: isSvg => `
        cursor: pointer;
        background: hsl(0, 0%, 80%);
        font-size: 24px;
        font-family: sans-serif;
        border-radius: 10px;
        margin: 10px 5px;
        min-width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        box-shadow: 0px 1px 3px -1px black;
        padding: ${isSvg ? '6px' : '0px'};
      `,
    },

    render({ props, classes, styles }) {

      const { onPressNum, onPressDel } = props;
      const ranges = [ [ 1, 2, 3, 4, 5, 6 ], [ 7, 8, 9, 0 ] ];

      return client.html`
        <div class='keyboard ${classes.container}'>
          <div class=${classes.range}>
            ${ranges[0].map(i => {
              return client.html`
                <div style=${styles.digit(false)} @click=${() => onPressNum(i)}>
                  <span class=${classes.digitspan}>${i}</span>
                </div>
              `;
            })}
          </div>
          <div class=${classes.range}>
            ${ranges[1].map(i => {
              return client.html`
                <div style=${styles.digit(false)} @click=${() => onPressNum(i)}>
                  <span class=${classes.digitspan}>${i}</span>
                </div>
              `;
            })}
            <div style=${styles.digit(true)}>
              ${IconsComp({
                icon: 'backspace',
                onClick: onPressDel,
                size: 30,
              })}
            </div>
          </div>

        </div>
      `;
    }

  });

};
