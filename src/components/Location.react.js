import {Component, PropTypes} from 'react';
/* global window:true */

export default class Location extends Component {
    constructor(props) {
        super(props);
        this.updateLocation = this.updateLocation.bind(this);
    }

    updateLocation(props) {
        const {pathname, setProps} = props;

        /*
         * if pathname isn't defined, then it wasn't set by the user
         * and it needs to be equal to the window.location.pathname
         * this just happens on page load
         */

        if (!pathname) {
            setProps({pathname: window.location.toString()});
        } else if (pathname !== window.location.toString()) {
            if (props.refresh) {
                // Refresh the page
                window.location.href = pathname;
            } else {
                if (setProps) setProps({pathname});                
                
                // Detect change in pathname 
                var _url = document.createElement('a')
                _url.href = pathname
                
                //Refresh if path has changed (load another dash)   
                if (_url.pathname !== window.location.pathname) {
                    window.location.href = pathname;
                    window.history.pushState({}, '', pathname);
                } else {                
                    //Just push history            
                    window.history.pushState({}, '', pathname);
                }
                
            }
        }
    }

    componentDidMount() {
        const listener = () => {
            return () => {
                const {setProps} = this.props;                
                var props_url = document.createElement('a');
                props_url.href = this.props.pathname ;
                //set props new pathname
                if (setProps) setProps({pathname: window.location.toString()});
                //If pathname has changed, do reload
                if (props_url.pathname !== window.location.pathname) {
                    window.history.pushState({}, '', window.location.toString());
                    window.location.reload();            
                }
            }
        };
        
        window.addEventListener('onpopstate', listener());
        window.onpopstate = listener('POP'); 
        

        //non-standard, emitted by Link.react
        window.addEventListener('onpushstate', listener());

        
        this.updateLocation(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateLocation(nextProps);
    }

    render() {
        return null;
    }
}

Location.propTypes = {
    id: PropTypes.string.isRequired,
    pathname: PropTypes.string,
    refresh: PropTypes.bool
};

Location.defaultProps = {
    refresh: true
};
