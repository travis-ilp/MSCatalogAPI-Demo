import React, { Component } from "react";
import { Accordion, AccordionItem } from "react-sanfona";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import "./Filter.css";
import { TagItemSuggestion } from "office-ui-fabric-react";

export class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTags: []
    };
  }

  filterTagHandler = newFilterTags => {
    this.setState({ filterTags: newFilterTags }, () => {});
  };

  renderTags = () => {
    try {
      if (!this.state.filterTags.length) {
        return;
      } else if (!this.props.filterResults) {
        return "Reset Filters";
      }

      return this.state.filterTags.map((item, idx) => {
        return (
          <div className="card-tags" id={`filter-tag-${item[1]}`}>
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
    this.state.filterTags.map(old => {
      if (old[1] === tag[1]) {
        const newFilterTags = this.state.filterTags.filter(el => {
          if (el[1] !== tag[1]) return el;
        });

        this.props.setInitialFilter();
        //const checkBox = document.getElementById(`checkbox-${tag[1]}`);

        this.setState({ filterTags: newFilterTags }, () => {
          this.setState(this.props.setInitialFilter()),
            () => {
              this.refilterAfterClear();
            };
          this.renderTags();
        });
      }
    });
  };

  refilterAfterClear = () => {
    try {
      let filter = [];
      console.log(this.state.filterTags.length);
      if (this.state.filterTags.length) {
        this.state.filterTags.map(tag => {
          //  this.checkboxHandler(tag[0].type.toLowerCase(), tag[1]);

          this.props.filterResults.map(item => {
            if (tag[0].type.toLowerCase().includes(tag[1])) {
              filter.push(item);
            }
          });
        });
        //this.props.filterSearch(filter);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  checkboxHandler = (filterElTitle, filterEl) => {
    const filter = [];
    let tagObject = {};
    tagObject = this.props[filterElTitle];
    tagObject.type =
      filterElTitle.charAt(0).toUpperCase() + filterElTitle.substring(1);

    this.props.filterResults.map(item => {
      if (item[filterElTitle].includes(filterEl)) {
        filter.push(item);
      }
    });

    let newFilterTags = this.state.filterTags;

    let tagIsIn = false;

    for (const obj of newFilterTags) {
      if (obj[1] === filterEl) {
        tagIsIn = true;
        console.log("removing duplicate", tagIsIn, obj);
        this.clearTag(obj);
        break;
      }
    }

    if (!tagIsIn) {
      console.log("here");
      newFilterTags.push([tagObject, filterEl]);
      this.setState({ filterTags: newFilterTags });
    }

    this.props.filterSearch(filter);
  };

  render() {
    const { products, roles, levels, type } = this.props;

    const filterElementNames = ["Products", "Roles", "Levels", "Type"];
    const filterEl = [products, roles, levels, type];
    try {
      return (
        <div className="filter-container">
          <div id="filter-tags">{this.renderTags()}</div>

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
                              id={`checkbox-${item.id}`}
                              className="list-item"
                              aria-checked="false"
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
