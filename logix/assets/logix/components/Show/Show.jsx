import React from 'react';

/**
 * Stateless React component that just displays the output of the derivation.
 * @param {dict} props - dict of props passed in by Derivation component.
 * @return {html} - returns html to be displayed.
 */
const Show = (props) => {
  const lines = [];
  let showStatement;
  // Construct derivation lines.
  if (props.premises[0].premises.length > 0) {
    props.premises[0].premises.forEach((premise, _) => {
      lines.push(
          <p>{premise.getID()}: {premise.getCommandText()} {
            premise.getPremiseString()}</p>
      );
    });
  }

  // Construct show statement.
  if (props.solved) {
    showStatement = <p><strike>Show</strike> {
      props.conclusion.getPremiseString()}</p>;
  } else {
    showStatement = <p>Show {props.conclusion.getPremiseString()}</p>;
  }

  // Add show statement to the front.
  lines.unshift(showStatement);

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  return (
    <div>
      {lines}
    </div>
  );
};

export default Show;
