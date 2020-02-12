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
      products: {}
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

        // console.log(this.state);
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

      const children = obj.children;
      console.log("Child tree ", children);
      for (const child of children) {
        if (child.id === product) {
          return child.name;
        }
      }
    }
    console.warn("NOT RESOLVED");
    //return name;
  };

  renderSearch = type => {
    try {
      //console.log(this.state.learningPaths);
      let typeOfOption;

      if (type === "learningPaths") {
        typeOfOption = this.state.learningPaths.splice(0, 30);
      } else if (type === "modules") {
        typeOfOption = this.state.modules.splice(0, 30);
      }
      //taking only the first 10 for performance purposes
      //console.log(modules);

      return (
        <div className="card-container">
          {typeOfOption.map(result => {
            return (
              <DocumentCard className="card" label="basic card">
                <DocumentCardTitle className="card-head" />
                <div className="image-wrapper">
                  <img
                    className="image"
                    src={result.icon_url}
                    alt={`${result.title}`}
                  />
                  <div>
                    <div className={result.type}>
                      {`${result.type}`.toUpperCase()}{" "}
                    </div>
                  </div>
                  <span id="title-link">
                    <a
                      id="title-link"
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h5>{result.title}</h5>
                    </a>
                  </span>
                  <div className="card-bottom">
                    <div className="card-duration">
                      Duration: {this.calculateTime(result.duration_in_minutes)}{" "}
                    </div>
                    <span>
                      <div className="card-tags">
                        {this.findProducts(result.products[0])}
                      </div>
                      <div className="card-tags">{result.roles[0]} </div>
                      <div className="card-tags">{result.levels[0]} </div>
                    </span>
                  </div>
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
          />
        </div>
        <div className="column-right">
          {this.renderSearch("learningPaths")}
          {this.renderSearch("modules")}
        </div>
      </div>
    );
  }
}

export default Card;
