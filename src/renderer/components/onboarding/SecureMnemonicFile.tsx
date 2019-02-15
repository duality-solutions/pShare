import React, { ChangeEvent, Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import { createValidatedFailurePayload } from "../../../shared/system/validator/createValidatedFailurePayload";
import { createValidatedSuccessPayload } from "../../../shared/system/validator/createValidatedSuccessPayload";
import { NamedValue } from "../../../shared/system/validator/NamedValue";
import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import PshareSecureFileSvg from "../../assets/svgs/p-share-secure-file.svg";
import { validationScopes } from "../../reducers/validationScopes";
import Box from "../ui-elements/Box";
import { ArrowButton, BackArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import LoadingSpinner from "../ui-elements/LoadingSpinner";
import { H1, H3, Text } from "../ui-elements/Text";

export interface SecureMnemonicFileStateProps {
    mnemonicFilePassword: string
    isValidating: boolean,
    validationResult?: ValidationResult<string>
}
export interface SecureMnemonicFileDispatchProps {
    mnemonicFilePasswordSubmit: (password: string) => void,
    fieldValidated: (validationInfo: NamedValue<ValidationResult<string>>) => void
    resetValidationForField: (validationPayload: NamedValue<void>) => void
    mnemonicFilePasswordCancelled: () => void
}
type SecureMnemonicFileProps = SecureMnemonicFileDispatchProps & SecureMnemonicFileStateProps

interface SecureMnemonicFileComponentState {
    password: string,
    confirmPassword: string,
}
export class SecureMnemonicFile extends Component<SecureMnemonicFileProps, SecureMnemonicFileComponentState>{
    constructor(props: SecureMnemonicFileProps) {
        super(props)
        this.state = { password: "", confirmPassword: "" }
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string = e.target.name
        let value: string = e.target.value
        if (name === 'password') {
            this.setState(state => ({ ...state, password: value }))
        }
        else if (name === 'confirmPassword') {
            this.setState(state => ({ ...state, confirmPassword: value }))
        }
        this.props.resetValidationForField({ scope: validationScopes.mnemonicFilePassword, name: "mnemonicFilePassword" })
    }
    handleSubmit = (e: FormEvent) => {
        console.log("submit", this.state)

        try {
            if (this.state.password !== this.state.confirmPassword) {
                const payload = createValidatedFailurePayload(validationScopes.mnemonicFilePassword, "mnemonicFilePassword", "Passwords do not match", this.state.password);
                this.props.fieldValidated(payload)

            }
            else if (!/.{6,}/.test(this.state.password)) {
                const payload = createValidatedFailurePayload(validationScopes.mnemonicFilePassword, "mnemonicFilePassword", "Password must be > 6 characters", this.state.password);
                this.props.fieldValidated(payload)
            }
            else {
                const payload = createValidatedSuccessPayload(validationScopes.mnemonicFilePassword, "mnemonicFilePassword", this.state.password);
                this.props.fieldValidated(payload)
                this.props.mnemonicFilePasswordSubmit(this.state.password)
            }

        } finally {
            //if we don't prevent form submission, causes a browser reload
            e.preventDefault()

        }
    }

    render() {
        const { isValidating, validationResult, mnemonicFilePasswordCancelled } = this.props
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
                <H1 align="center" colored fontWeight="600">Create Account</H1>
                <Container height="50vh" margin="10% 0 0 0">
                    <form onSubmit={this.handleSubmit}>
                        <Box direction="column" align="center" width="100%">
                            <BackArrowButton onClick={() => mnemonicFilePasswordCancelled()} />
                            <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                                <Card width="100%" align="center" minHeight="225px" padding="2em 4em 2em 2em">
                                    <Box display="flex" direction="row" margin="0">
                                        <Box width="120px" margin="0">
                                            <img src={PshareSecureFileSvg} width="60px" height="60px" /> </Box>
                                        <Box margin="0 0 0 2em">
                                            <H3>Secure file</H3>
                                            <Text fontSize="14px">Create a secure file password </Text>
                                            <Input value={this.state.password} name="password" onChange={this.handleChange} placeholder="Password"
                                                type="password" margin="1em 0 1em 0" padding="0 1em 0 1em" autoFocus={true} error={showFieldErrors} disabled={isValidating} />
                                            <Text fontSize="14px">Confirm Password</Text>
                                            <Input value={this.state.confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder="Password"
                                                type="password" margin="1em 0 1em 0" padding="0 1em 0 1em" error={showFieldErrors} disabled={isValidating} />
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
                                <ArrowButton label="Continue" type="submit" disabled={isValidating} />
                                {
                                    isValidating ? <LoadingSpinner active label="Encrypting your MnemonicFile ... " size={50} /> : <></>
                                }
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}



