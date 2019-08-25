import React from 'react';

/**
 * Stateless React component that just displays the output of the derivation.
 * @param {dict} props - dict of props passed in by Derivation component.
 * @return {html} - returns html to be displayed.
 */
const Show = (props) => {
  const lines = [];

  if (props.premises[0].premises.length > 0) {
    props.premises[0].premises.forEach((premise, _) => {
      lines.push(
          <p>{premise.getID()}: {premise.getCommandText()} {
            premise.getPremiseString()}</p>
      );
    });
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  return (
    <div>
      <p>Show {props.conclusion.getPremiseString()}</p>
      {lines}
    </div>
  );
};

export default Show;
