import React, { ChangeEvent, Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
// import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton, BackButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
// import Input from "../ui-elements/Input";
import { H1, H3 } from "../ui-elements/Text";
import PsharePassphrase from "../../assets/svgs/p-share-pass-phrase-blue.svg";
import { MnemonicInput } from "../ui-elements/Input";
// import { NamedValue } from "../../../shared/system/validator/NamedValue";
// import { validationScopes } from "../../reducers/validationScopes";

export interface RestoreWithPassphraseStateProps {
    // isValidating: boolean,
    // validationResult?: ValidationResult<string>
}
export interface RestoreWithPassphraseDispatchProps {
    restoreSync: () => void 
}
type RestoreWithPassphraseProps = RestoreWithPassphraseDispatchProps & RestoreWithPassphraseStateProps

interface RestoreWithPassphraseComponentState {

}

export class RestoreWithPassphrase extends Component<RestoreWithPassphraseProps, RestoreWithPassphraseComponentState>{
    constructor(props: RestoreWithPassphraseProps) {
        super(props)
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    }

    handleSubmit = (e: FormEvent) => {
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
    }

    render() {
        // const { isValidating, validationResult } = this.props
        // const validationFailed = typeof validationResult !== 'undefined' && !validationResult.success && !validationResult.isError
        // const networkFailure = typeof validationResult !== 'undefined' && !validationResult.success && validationResult.isError

        return <>
            <Box width="100%" margin="2em 0 -1.5em 0" align="center">
                <AppLogo src={logo} width="100px" height="120px" />
            </Box>
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>
                <H1 align="center" colored fontWeight="600">Restore Account</H1>
                <Container height="50vh" margin="10% 0 0 0">
                    <form onSubmit={this.handleSubmit}>

                        <Box direction="column" align="center" width="100%">
                            <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                            <BackButton onClick={()=>{}} margin="150px 0 0 -100px"/>
                                <Card width="100%" align="center" minHeight="225px" padding="2em 4em 2em 2em">
                                <Box display="flex" direction="row" margin="0">
                                        <Box width="60px" margin="0">
                                            <img src={PsharePassphrase} width="60px" height="60px" /> 
                                        </Box> 
                                        <Box margin="1em 0 0 2em">
                                        <H3 margin="0 0 1em 0">Restore using passphrase </H3>
                                        <MnemonicInput placeholder="Enter passphrase"/>
                                        </Box>
                                        </Box>
                                </Card>
                            </Box>
                            <Box direction="column" width="700px" align="right" margin="0 auto 10px auto">
                                <ArrowButton label="Continue" type="submit" onClick={()=> this.props.restoreSync()} /> 
                                {/* disabled={isValidating} /> */}
                                {/* { */}
                                    {/* isValidating ? <div>show spinner</div> : <></> */}
                                {/* } */}
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}
