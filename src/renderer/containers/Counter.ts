import { connect } from 'react-redux'
import CounterActions from "../../shared/actions/counter";
import { RendererRootState } from '../reducers'
import { Counter, CounterDispatchProps, CounterStateProps } from '../components/Counter';
import { push } from 'connected-react-router';
import { MapPropsToDispatchObj } from '../../shared/system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): CounterStateProps => {
    return {
        counter: state.counter
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<CounterDispatchProps> = { ...CounterActions, navgigateHome: () => push("/") };

export default connect(mapStateToProps, mapDispatchToProps)(Counter)