import React, { ChangeEvent, Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import { createValidatedFailurePayload } from "../../../shared/system/validator/createValidatedFailurePayload";
// import { createValidatedSuccessPayload } from "../../../shared/system/validator/createValidatedSuccessPayload";
import { NamedValue } from "../../../shared/system/validator/NamedValue";
import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import { validationScopes } from "../../reducers/validationScopes";
import Box from "../ui-elements/Box";
import { ArrowButton, BackButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import LoadingSpinner from "../ui-elements/LoadingSpinner";
import { H1, Text, H3 } from "../ui-elements/Text";
import PshareSecureFileSvg from "../../assets/svgs/p-share-secure-file.svg";



export interface SecureFilePasswordStateProps {
    password: string
    isValidating: boolean,
    validationResult?: ValidationResult<string>
}
export interface SecureFilePasswordDispatchProps {
    submitPassword: (password: string) => void,
    fieldValidated: (validationInfo: NamedValue<ValidationResult<string>>) => void
    resetValidationForField: (validationPayload: NamedValue<void>) => void
    restoreSync: () => void ,
    secureFilePasswordCancelled: () => void

}
type SecureFilePasswordProps = SecureFilePasswordDispatchProps & SecureFilePasswordStateProps

interface SecureFilePasswordComponentState {
    password: string,
}
export class SecureFilePassword extends Component<SecureFilePasswordProps, SecureFilePasswordComponentState>{
    constructor(props: SecureFilePasswordProps) {
        super(props)
        this.state = { password: ""}
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string = e.target.name
        let value: string = e.target.value
        if (name === 'password') {
            this.setState(state => ({ ...state, password: value }))
        }
        this.props.resetValidationForField({ scope: validationScopes.password, name: "password" })
    }
    handleSubmit = (e: FormEvent) => {
        console.log("submit", this.state)
        try {
             if (!/.{6,}/.test(this.state.password)) {
                const payload = createValidatedFailurePayload(validationScopes.password, "password", "Password must be > 6 characters", this.state.password);
                this.props.fieldValidated(payload)
            }
            else {
                this.props.restoreSync()
                // const payload = createValidatedSuccessPayload(validationScopes.password, "password", this.state.password);
                // this.props.fieldValidated(payload)
                // this.props.submitPassword(this.state.password)
            }

        } finally {
            //if we don't prevent form submission, causes a browser reload
            e.preventDefault()

        }
    }

    render() {
        const { isValidating, validationResult } = this.props
        const validationFailed = typeof validationResult !== 'undefined' && !validationResult.success
        const showFieldErrors = (validationFailed && typeof validationResult !== 'undefined' && !validationResult.isError)
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
                            <BackButton onClick={()=> this.props.secureFilePasswordCancelled()} margin="130px 0 0 -100px"/>
                                <Card width="100%" align="center" minHeight="300px" padding="2em 4em 2em 2em">
                                <Box display="flex" direction="row" margin="0">
                                        <Box width="60px" margin="0">
                                            <img src={PshareSecureFileSvg} width="60px" height="60px" /> 
                                        </Box> 
                                        <Box margin="1em 0 0 2em">
                                        <H3 margin="0 0 1em 0">Restore using Secure Restore File </H3>
                                        <Text fontSize="0.8em">Enter your secure file password</Text>
                                        <Input value={this.state.password} name="password" onChange={this.handleChange} placeholder="Password"
                                        type="password" margin="1em 0 1em 0" padding="0 1em 0 1em" autoFocus={true} error={showFieldErrors}  disabled={isValidating}/>
                                        <Text fontSize="0.8em" margin="0">This is the password used to create the secure file</Text>                                       
                                        {
                                            validationFailed
                                                ? (typeof validationResult !== 'undefined' ? validationResult.validationMessages : []).map((e, i) => <Text align="center" color="#e30429" key={i}>{e}</Text>)
                                                : <></>
                                        }
                                      </Box>
                                        </Box>
                                   
                                </Card>
                            </Box>
                            <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                                <ArrowButton label="Continue" type="submit" disabled={isValidating}/>
                                {
                                    isValidating ?  <LoadingSpinner active label="Encrypting your data ... " size={50}/> : <></>
                                }
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}



