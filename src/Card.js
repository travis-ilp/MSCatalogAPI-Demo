import React, { Component } from "react";
import axios from "axios";
import {
  DocumentCard,
  DocumentCardTitle
} from "office-ui-fabric-react/lib/DocumentCard";
import "./Card.css";
import Filter from "./Filter";

export class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: {},
      learningPaths: {},
      levels: {},
      roles: {},
      products: {},
      filterResults: {},
      filterTags: [],
      type: [
        { id: "learningPath", name: "Learning Path" },
        { id: "module", name: "Module" }
      ]
    };
    this.getSearch();
  }

  getSearch = () => {
    const searchUrl = `https://docs.microsoft.com/api/learn/catalog?locale=en-us&clientid=contoso`;
    axios
      .get(searchUrl)
      .then(response => {
        this.setState(
          {
            modules: response.data.modules,
            learningPaths: response.data.learningPaths,
            levels: response.data.levels,
            roles: response.data.roles,
            products: response.data.products
          },
          () => {
            this.setInitialFilter();
          }
        );
      })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          console.warn(error);
          this.setState({
            message: "Failed to fetch the data. Check network"
          });
        }
      });
  };

  setInitialFilter = () => {
    let allLearning = [];
    Array.prototype.push.apply(allLearning, this.state.learningPaths);
    Array.prototype.push.apply(allLearning, this.state.modules);

    this.setState({ filterResults: allLearning });
  };

  resetFilters = () => {};

  calculateTime = minutes => {
    const timeMin = parseInt(minutes);
    if (isNaN(timeMin)) {
      return 0;
    }

    if (timeMin < 60) {
      return timeMin + "M";
    } else {
      const timeHour = Math.floor(timeMin / 60);
      return timeHour + "H " + (timeMin % 60) + "M";
    }
  };

  filterSearch = (filteredCards, filterClass, filterItem) => {
    let filterTag = [...this.state.filterTags];

    filterTag.push([filterClass, filterItem]);

    this.setState({ filterResults: filteredCards, filterTags: filterTag });
  };

  filterTagHandler = newFilterTags => {
    this.setState({ filterTags: newFilterTags }, () => {
      console.log(newFilterTags, this.state.filterTags);
    });
  };

  findTag = (tagId, itemType) => {
    for (const obj of this.state[itemType]) {
      if (obj.id === tagId || obj[0] === tagId) {
        return obj.name;
      }

      if (obj.children) {
        const children = obj.children;
        for (const child of children) {
          if (child.id === tagId) {
            return obj.name;
          }
        }
      }
    }
    console.warn(`${tagId} NOT RESOLVED`);
  };

  renderSearch = restrictResults => {
    try {
      let allLearning = this.state.filterResults;

      if (allLearning.length === 0) {
        return <div className="card-container">No results Found</div>;
      }
      return (
        <div>
          <div>
            <p className="card-results-count">{`${allLearning.length} items found`}</p>
          </div>
          <div className="card-container">
            {allLearning.map(result => {
              return (
                <DocumentCard className="card" label="basic card">
                  <DocumentCardTitle className="card-head" />
                  <div className="image-wrapper">
                    <img
                      className="image"
                      src={result.icon_url}
                      alt={`${result.title}`}
                    />
                  </div>

                  <div className="card-type">
                    {`${result.type}`.toUpperCase()}{" "}
                  </div>

                  <div className="card-title-link">
                    <a
                      id="title-link"
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h5>{result.title}</h5>
                    </a>
                  </div>
                  <div className="card-bottom">
                    <div className="card-duration">
                      {this.calculateTime(result.duration_in_minutes)}{" "}
                    </div>
                    <span>
                      <div className="card-tags">
                        {this.findTag(result.products[0], "products")}
                      </div>
                      <div className="card-tags">
                        {this.findTag(result.roles[0], "roles")}{" "}
                      </div>
                      <div className="card-tags">
                        {this.findTag(result.levels[0], "levels")}{" "}
                      </div>
                    </span>
                  </div>
                </DocumentCard>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      // console.log(error);
      return (
        <div>
          <p>Loading Page</p>
        </div>
      );
    }
  };

  render() {
    const {
      levels,
      roles,
      products,
      filterResults,
      filterTags,
      learningPath,
      modules,
      type
    } = this.state;

    return (
      <div className="row">
        <div className="column-left">
          <Filter
            levels={levels}
            roles={roles}
            products={products}
            learningPath={learningPath}
            modules={modules}
            type={type}
            filterResults={filterResults}
            filterSearch={this.filterSearch}
            setInitialFilter={this.setInitialFilter}
            findTag={this.findTag}
            filterTags={filterTags}
            filterTagHandler={this.filterTagHandler}
          />
        </div>
        <div className="column-right">{this.renderSearch(0)}</div>
      </div>
    );
  }
}

export default Card;
