
export const Icons = ui => {

  const { IconsSVGs } = ui.lib;

  return ui.hoc({

    styles: {
      div: (size, enabled, inStyle = '') => `
        transition: all .6s ease;
        width: ${size}px;
        height: ${size}px;
        cursor: ${enabled ? 'pointer' : 'auto'};
        opacity: ${enabled ? 1 : 0.5};
        ${inStyle}
      `,
    },

    render({ props, styles }) {

      const {
        icon,
        size,
        enabled = true,
        inStyle,
        className = ''
      } = props;

      if (!IconsSVGs[icon]) return '<>';

      const onClick = () => enabled ? props.onClick() : undefined;

      return ui.html`
        <div
          class=${className}
          style=${styles.div(size, enabled, inStyle)}
          @click=${onClick}
        >
          ${ui.unsafeHTML(IconsSVGs[icon])}
        </div>
      `;
    }

  });
};

