import React, { Component } from 'react';
import { SearchTypeInput } from './SearchTypeInput';
import { TextInput, NumberListInput } from './WebsiteInput';
import PropTypes from 'prop-types';
import cookie from 'react-cookies'
import styles from './css/Form.css';

export class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      website: '',
      sType: 'dfs',
      sLimit: 1,
      searchTerm: '',
      advancedOn: false,
      isLoading: false,
      prevStartPages: [],
      prevSearchTerms: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
    this.verifyInput = this.verifyInput.bind(this);
    this.createQueryData = this.createQueryData.bind(this);
    this.addToCookie = this.addToCookie.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  componentWillMount() {
    var psp = cookie.load('prevSearchInformation') || '';
    if(psp !== '' && psp !== null)
    {
      var pspJson = JSON.parse(JSON.parse(psp));
      this.setState({ 
        prevSearchTerms: pspJson.searchTerms,
        prevStartPages: pspJson.searchPages
        });
    }
  }

  toggleAdvancedOptions(){
    this.setState({ 
      advancedOn: !this.state.advancedOn
    });
    if(!this.state.advancedOn){
      this.setState({ searchTerm: '' });
    }
  }

  handleChange(e) {
    this.setState({
       [e.target.name]: e.target.value 
      });
  }

  handleChangeText(name, value){
    this.setState({
      [name]: value 
     });
  }

  verifyInput(){
    console.log(this.state.website, this.state.sType, this.state.sLimit);
    if(this.state.website !== '' && this.state.sType !== '' && this.state.sLimit !== ''){
      if(this.state.advanceOn && this.state.searchTerm !== ''){
        return true;
      }
      return true;
    }
    return false;
  }

  createQueryData(){
    return {
      url: this.state.website,
      depth: this.state.sLimit,
      dfs: this.state.sType,
      searchterm: this.state.searchTerm
    }
  }

  // When submitting a new search, save the search term on the cookie
  addToCookie(){
    // Check if the page is already in the object
    const psp = this.state.prevStartPages;
    if(!psp.includes(this.state.website)){
      psp.push(this.state.website);
      psp.sort();
    }

    const pst = this.state.prevSearchTerms;
    if(!pst.includes(this.state.searchTerm)){
      pst.push(this.state.searchTerm);
      pst.sort();
    }

    const cookieAdd = { 'searchPages': psp,
                        'searchTerms': pst};
    cookie.remove('prevSearchInformation', { path: '/' })
    // For some reason you have to stringify the results twice to get it in the correct format
    cookie.save('prevSearchInformation', JSON.stringify(JSON.stringify(cookieAdd)), { path: '/' });
  }

  handleSubmit(e) {
    e.preventDefault();
    //this.props.testFunc();
    this.props.toResults();
    if(this.verifyInput()){
      this.addToCookie()
      this.props.onQueryAPI(this.createQueryData());
    }
  }

  testThing = () =>{
    console.log(this.props);
  }

  render() {
    const button = (isEmpty(this.props.graphData)) ? (
      <div className={styles.btnAnimate}>
        <input className={styles.btnSignin} type="submit" value="Submit" />
      </div>
    ) : (
      <div className={styles.btnAnimate}>
        <div>
          <input className={styles.btnSigninHalf} type="submit" value="New Search" />
        </div>
        <div>
          <button onClick={this.props.toResults} className={styles.btnSigninHalf} type="button" >
            Previous Results
          </button>
        </div>
      </div>
    );
    return (
      <div className={styles.container}>
        <div className={styles.frame}>
          <div className={styles.nav}>
            <ul className={styles.links}>
              <li className={styles.signinActive}><a className={styles.btn}>Crawl Input</a></li>
            </ul>
          </div>
          <form onSubmit={this.handleSubmit} className={styles.formSignin}>
            <TextInput value={this.state.website} name="website" onChange={this.handleChangeText} 
              label="Website:" isActive={true} prevSearchTerms = {this.state.prevStartPages} 
              inputStyle={styles.formStyling}/>   
            <SearchTypeInput name="sType" onChange={this.handleChange}/>
            <NumberListInput name="sLimit" onChange={this.handleChange} label="Search Limit:"
            type={this.state.sType} value={this.state.sLimit}/> 
            <div>
              <input type="checkbox" id="checkbox" onChange={this.toggleAdvancedOptions} />
              <label htmlFor="checkbox" ><span className={styles.ui}></span>Advanced Options</label>
            </div>
            <TextInput value={this.state.searchTerm} name="searchTerm" onChange={this.handleChangeText} 
              label="Search Term:" isActive={this.state.advancedOn} 
              prevSearchTerms = {this.state.prevSearchTerms} inputStyle={styles.formStyling}
              />  
            {button}
          </form>
        </div>
      </div>
    );
  }
}

FormContainer.propTypes = {
  onQueryAPI: PropTypes.func.isRequired,
  toResults: PropTypes.func.isRequired
};

function isEmpty(obj) {
  // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}