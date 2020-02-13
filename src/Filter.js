import React, { Component } from "react";
import { Accordion, AccordionItem } from "react-sanfona";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import "./Filter.css";

export class Filter extends Component {
  constructor(props) {
    super(props);
   // this.changeState = this.changeState.bind(this);
  }

  levelsHandler(level) {
    const filter = [];
    this.props.learningPaths.map(path => {
      if (path.levels.includes(level)) {
        
        filter.push(path);
        
      }
    });

    this.changeState(filter);
  }

  changeState(arr) {
    this.props.functionName(arr);
  }

  rolesHandler = role => {
    console.log(role);
  };

  productsHandler = prod => {
    console.log(prod);
  };

  render() {
    const { products, roles, levels } = this.props;

    const filterElementNames = ["Products", "Roles", "Levels"];
    const filterEl = [products, roles, levels];
    try {
      return (
        <div className="accordion-wrapper">
          <h1>Filter</h1>
          <Accordion>
            {filterElementNames.map((el, idx) => {
              return (
                <AccordionItem title={`${el}`}>
                  <div className="accordion-item">
                    {/* {filterEl[idx].map(item => {
                      console.log(item);
                    })} */}

                    {filterEl[idx].map((item, idx) => {
                      return (
                        <Checkbox
                          label={`${item.name}`}
                          onChange={() => {
                            if (el === "Levels") {
                              this.levelsHandler(item.id);
                            } else if (el === "Roles") {
                              this.rolesHandler(item.id);
                            } else if (el === "Products") {
                              this.productsHandler(item.id);
                            }
                          }}
                        ></Checkbox>
                      );
                    })}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      );
    } catch (error) {
      //console.log(error);
      return <div>failed filter</div>;
    }
  }
}

export default Filter;
