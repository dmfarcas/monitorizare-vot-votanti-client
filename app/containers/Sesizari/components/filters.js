import React from 'react';
import styled from 'styled-components';
import Maps from 'components/selectCountry';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectedCountyAction, setActiveMapAction, setTypeAction, setCityAction, resetCountyAction, resetAllFiltersAction } from '../actions';
import { cities, activeMap } from '../selectors';
import * as _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

const FiltersWrap = styled.section`
  background: #fdda44;
  padding: 30px 0;
`;

const overflowElipsisStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

export class Filters extends React.PureComponent {
  constructor(props) {
    super(props);
    this.resetFilters = this.resetFilters.bind(this);
    this.state = {
      active: true,
      value: null,
    };
  }

  setActiveOption = (event) => {
    this.setState({ active: !this.state.active });
    this.props.setActiveMap(event.currentTarget.dataset.name);
    this.props.filterIncindents();
  }

  setIncindetType = (event, index, value) => {
    this.setState({ value });
    this.props.setType(value);
    this.props.filterIncindents();
  }

  selectCounty = (searchText, citiesArray) => {
    const getCity = _.find(citiesArray, (o) => o.text === searchText);
    if (_.isUndefined(getCity)) {
      this.props.resetCounty();
      this.props.filterIncindents();
    } else {
      this.props.selectedCounty(getCity.id);
      this.props.filterIncindents();
    }
  };

  selectCity = (event, index, value) => {
    this.props.setCity(value);
    this.props.filterIncindents();
  };

  resetFilters = () => {
    this.setState({ value: null });
    this.countyRef.setState({ searchText: '' });
    this.cityRef.setState({ searchText: '' });
    this.props.resetAllFilters();
    this.props.filterIncindents();
  }

  render() {
    const buttonStyle = {
      height: '60px',
    };

    const buttonOverlayStyle = {
      height: '60px',
    };

    const buttonLabelStyle = {
      lineHeight: '60px',
      fontSize: '16px',
      letterSpacing: '1px',
    };

    return (
      <FiltersWrap className="interact">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3">
                  <Maps half={false} active={this.state.active} setActiveOption={this.setActiveOption} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                  <div className="types">
                    <SelectField ref={(cb) => { this.typeRef = cb; }} floatingLabelText="Tipul sesizarii" floatingLabelFixed value={this.state.value} onChange={this.setIncindetType} hintText="Alege tipul sesizarii" fullWidth className="dropdown" labelStyle={overflowElipsisStyle}>
                      <MenuItem value="0" primaryText="Toate" />
                      {this.props.incidentTypes.map((incident) =>
                        <MenuItem key={incident.id} value={incident.id} primaryText={incident.name} />
                      )}
                    </SelectField>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                  <AutoComplete ref={(cb) => { this.countyRef = cb; }} style={this.props.map === 'abroad' ? { display: 'none' } : {}} hintText="Cauta judetul" floatingLabelText="Judetul" floatingLabelFixed fullWidth openOnFocus filter={AutoComplete.fuzzyFilter} maxSearchResults={5} dataSource={this.props.counties.length > 0 ? this.props.counties : []} onUpdateInput={this.selectCounty} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                  <AutoComplete ref={(cb) => { this.cityRef = cb; }} style={this.props.map === 'abroad' ? { display: 'none' } : {}} hintText="Cauta orasul" floatingLabelText="Orasul" floatingLabelFixed fullWidth openOnFocus filter={AutoComplete.fuzzyFilter} maxSearchResults={45} dataSource={this.props.citiesPerCounty.length > 0 ? this.props.citiesPerCounty : []} onUpdateInput={this.selectCity} />
                </div>
              </div>
              <RaisedButton
                style={{ float: 'right' }}
                label="Reseteaza filtrele"
                buttonStyle={buttonStyle}
                overlayStyle={buttonOverlayStyle}
                labelStyle={buttonLabelStyle}
                primary
                onClick={this.resetFilters}
              />
            </div>
          </div>
        </div>
      </FiltersWrap>
    );
  }
}

Filters.propTypes = {
  counties: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  citiesPerCounty: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  incidentTypes: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  selectedCounty: React.PropTypes.func,
  setActiveMap: React.PropTypes.func,
  resetCounty: React.PropTypes.func,
  resetAllFilters: React.PropTypes.func,
  filterIncindents: React.PropTypes.func,
  setType: React.PropTypes.func,
  setCity: React.PropTypes.func,
  map: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    selectedCounty: (cityId) => dispatch(selectedCountyAction(cityId)),
    setActiveMap: (map) => dispatch(setActiveMapAction(map)),
    setType: (id) => dispatch(setTypeAction(id)),
    setCity: (id) => dispatch(setCityAction(id)),
    resetCounty: () => dispatch(resetCountyAction()),
    resetAllFilters: () => dispatch(resetAllFiltersAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  citiesPerCounty: cities(),
  map: activeMap(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
