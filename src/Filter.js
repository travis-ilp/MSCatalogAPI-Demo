import React, { Component } from "react";
import { Accordion, AccordionItem } from "react-sanfona";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import "./Filter.css";

export default props => {
  const { products, roles, levels, learningPaths } = props;
  const filterElementNames = ["Products", "Roles", "Levels"];
  const filterEl = [products, roles, levels];

  function levelsHandler(level) {
    const filtered = [];

    for (const obj of learningPaths) {
      if (obj.levels.includes(level)) {
        filtered.push(obj);
      }
    }
  }

  try {
    return (
      <div className="accordion-wrapper">
        <Accordion>
          {filterElementNames.map(function(el, idx) {
            return (
              <AccordionItem title={`${el}`}>
                <div className="accordion-item">
                  {filterEl[idx].map(function(item, idx) {
                    return <Checkbox label={`${item.name}`}></Checkbox>;
                  })}
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  } catch {
    return <div>failed filter</div>;
  }
};
