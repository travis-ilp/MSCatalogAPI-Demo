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
    this.getSearch();
    this.state = {
      modules: {},
      learningPaths: {},
      levels: {},
      roles: {},
      products: {},
      results: {}
    };
  }

  getSearch = () => {
    const searchUrl = `https://docs.microsoft.com/api/learn/catalog?locale=en-us&clientid=contoso`;
    axios
      .get(searchUrl)
      .then(response => {
        this.setState({
          modules: response.data.modules,
          learningPaths: response.data.learningPaths,
          levels: response.data.levels,
          roles: response.data.roles,
          products: response.data.products
        });

        //this.renderSearch();
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

  findProducts = product => {
    for (const obj of this.state.products) {
      if (obj.id === product || obj[0] === product) {
        return obj.name;
      }

      if (obj.children) {
        const children = obj.children;
        for (const child of children) {
          if (child.id === product) {
            return obj.name;
          }
        }
      }
    }
    console.warn("Product NOT RESOLVED");
    //return name;
  };

  findLevels = level => {
    for (const obj of this.state.levels) {
      if (obj.id === level || obj[0] === level) {
        return obj.name;
      }
    }
    console.warn("Level NOT RESOLVED");
  };

  findRoles = role => {
    for (const obj of this.state.roles) {
      if (obj.id === role || obj[0] === role) {
        return obj.name;
      }
    }
    console.warn("Role NOT RESOLVED");
  };

  functionName = arr => {
    console.log(arr);
    if (!this.state.learningPaths.length) {
      this.getSearch();
    }

    this.setState({ learningPaths: [...arr] });
    this.renderSearch("learningPaths");
  };

  renderSearch = type => {
    try {
      let allLearning = [];
      Array.prototype.push.apply(
        allLearning,
        this.state.learningPaths.slice(0, type)
      );
      Array.prototype.push.apply(
        allLearning,
        this.state.modules.slice(0, type)
      );

      return (
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
                      {this.findProducts(result.products[0])}
                    </div>
                    <div className="card-tags">
                      {this.findRoles(result.roles[0].id)}{" "}
                    </div>
                    <div className="card-tags">
                      {this.findLevels(result.levels[0])}{" "}
                    </div>
                  </span>
                </div>
              </DocumentCard>
            );
          })}
        </div>
      );
    } catch {
      return <div>loading {type}</div>;
    }
  };

  render() {
    const { levels, roles, products, learningPaths } = this.state;
    return (
      <div className="row">
        <div className="column-left">
          <Filter
            levels={levels}
            roles={roles}
            products={products}
            learningPaths={learningPaths}
            functionName={this.functionName}
          />
        </div>
        <div className="column-right">
          {this.renderSearch(100)}
          {this.renderSearch(100)}
        </div>
      </div>
    );
  }
}

export default Card;
