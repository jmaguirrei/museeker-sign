


export const Button = client => {

  return client.hoc({

    classes: {
      div: `
        cursor: pointer;
        text-align: center;
        transition: all .6s ease;
        user-select: none;
        width: 100%;
        box-shadow: inset 0px 0px 200px hsla(0, 0%, 0%, 0), 0px 1px 3px -1px black;
        &:hover {
          box-shadow: inset 0px 0px 200px hsla(0, 0%, 0%, 0.3), 0px 1px 3px -1px black;
        }
      `,
      a: `
        text-decoration: none;
        color: inherit;
      `,
    },

    styles: {
      div: (color, bgColor, height) => `
        background-color: ${bgColor};
        border-radius: ${height}px;
        color: ${color};
        height: ${height}px;
        line-height: ${height}px;
      `,
    },

    render({ props, classes, styles }) {

      const {
        text,
        color,
        bgColor,
        height,
        href,
        onClick,
      } = props;

      return client.html`
        <div
          @click=${onClick}
          class=${classes.div}
          style=${styles.div(color, bgColor, height)}
        >
          ${
            href
            ? client.html.unsafeHTML(`<a href='${href}' class='${classes.a}'>${text}</a>`)
            : text
          }
        </div>
      `;
    }

  });

};
