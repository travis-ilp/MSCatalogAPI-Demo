import React, { Component } from "react";
import { Accordion, AccordionItem } from "react-sanfona";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import "./Filter.css";

export class Filter extends Component {
  constructor(props) {
    super(props);
  }

  filterTagHandler = () => {
    console.log(this.props.filterTags, "From filter");
  };

  renderTags = () => {
    try {
      if (!this.props.filterTags.length) {
        return;
      }
      return this.props.filterTags.map(item => {
        return (
          <div className="card-tags">
            {item[0].type} :{" "}
            {this.props.findTag(item[1], item[0].type.toLowerCase())}
            <button
              className="delete"
              type="button"
              onClick={this.clearTag.bind(null, item)}
            >
              &times;
            </button>
          </div>
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  clearTag = tag => {
    this.props.filterTags.map(old => {
      if (old[1] === tag[1]) {
        const newFilterTags = this.props.filterTags.filter(el => {
          if (el[1] !== tag[1]) {
            return el;
          }
        });

        this.props.setInitialFilter();

        newFilterTags.map(tag => {
          this.checkboxHandler(tag[0].type, tag[1]);
        });
        this.props.filterTagHandler(newFilterTags);
      }
    });
  };

  checkboxHandler = (filterElTitle, filterEl) => {
    const filter = [];
    let tagObject = {};
    console.log(filterElTitle);

    this.props.filterResults.map(item => {
      if (item[filterElTitle].includes(filterEl)) {
        filter.push(item);
        tagObject = this.props[filterElTitle];
        tagObject.type =
          filterElTitle.charAt(0).toUpperCase() + filterElTitle.substring(1);
        console.log(tagObject.type);
      }
    });

      this.props.filterSearch(filter, tagObject, filterEl);

  };

  render() {
    const { products, roles, levels, type } = this.props;

    const filterElementNames = ["Products", "Roles", "Levels", "Type"];
    const filterEl = [products, roles, levels, type];
    try {
      return (
        <div className="filter-container">
          {this.renderTags()}
          <div className="accordion-wrapper">
            <div className="accordion-title">
              <p>Filter</p>
            </div>

            <Accordion>
              {filterElementNames.map((el, idx) => {
                return (
                  <AccordionItem
                    title={`${el}`}
                    className="accordion-title-item"
                  >
                    <div className="accordion-filter-item">
                      {filterEl[idx].map((item, idx) => {
                        return (
                          <div className="accordion-item">
                            <Checkbox
                              label={`${item.name}`}
                              className="list-item"
                              onChange={() => {
                                this.checkboxHandler(el.toLowerCase(), item.id);
                              }}
                            ></Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div>
          <p>Loading: Filter </p>
        </div>
      );
    }
  }
}

export default Filter;
