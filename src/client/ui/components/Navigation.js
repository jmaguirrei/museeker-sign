
import { Icons } from './Icons';

const size = 50;

export const Navigation = client => {

  const IconsComp = Icons(client);

  return client.hoc({

    styles: {
      container: `
        display: flex;
        align-items: center;
        margin: 50px 30px;
      `,
      text: (text, color) => `
        flex: 1;
        text-align: center;
        opacity: ${text ? 1 : 0};
        transition: opacity .6s ease;
        color: ${color || 'initial'};
      `,
    },

    classes: {
      'signup-right-enabled': `
        background-position: center;
        transition: background 0.3s;
        background: ${client.lib.Colors.GREEN_SIGNUP};
        border-radius: 50%;
        fill: white;
        box-shadow: -1px 1px 3px -1px black;
        &:active {
          background-color: hsla(0, 0%, 0%, 0.8);
          background-size: 100%;
          transition: background 0s;
        }
      `,
      'signin-right-enabled': `
        background-position: center;
        transition: background 0.3s;
        background: ${client.lib.Colors.BLUE_SIGNIN};
        border-radius: 50%;
        fill: white;
        box-shadow: -1px 1px 3px -1px black;
        &:active {
          background-color: hsla(0, 0%, 0%, 0.8);
          background-size: 100%;
          transition: background 0s;
        }
      `,
    },

    render({ props, styles, classes }) {

      const {
        currentPage,
        onClickLeft,
        onClickRight,
        leftEnabled,
        rightEnabled,
        text,
        color,
      } = props;

      return client.html`
        <div class='navigation' style=${styles.container}>
          ${IconsComp({
            icon: 'chevron-left',
            onClick: onClickLeft,
            size,
            enabled: leftEnabled,
          })}
          <div style=${styles.text(text, color)}>
            ${text || ''}
          </div>
          ${IconsComp({
            icon: 'chevron-right',
            onClick: onClickRight,
            size,
            enabled: rightEnabled,
            className: !rightEnabled
              ? ''
              : currentPage === 'signup'
                ? classes['signup-right-enabled']
                : classes['signin-right-enabled'], // forgot also uses signin styles
          })}
        </div>
      `;
    }

  });

};

