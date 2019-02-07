import React, { ChangeEvent, Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";

export interface PasswordCreateStateProps {
    password: string
    // isValidating: boolean,
    // validationResult?: ValidationResult<string>

}
export interface PasswordCreateDispatchProps {
    submitPassword: (password: string) => void,
    // resetValidation: (validationPayload: ValidationPayload<void>) => void
}
type PasswordCreateProps = PasswordCreateDispatchProps & PasswordCreateStateProps

interface PasswordCreateComponentState {
    password: string,
    confirmPassword: string,
}
export class PasswordCreate extends Component<PasswordCreateProps, PasswordCreateComponentState>{
    constructor(props: PasswordCreateProps) {
        super(props)
        this.state = { password: "", confirmPassword: ""}
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string = e.target.name
        let value: string = e.target.value
        if (name === 'password') this.setState({ password: value })
        else if (name === 'confirmPassword') this.setState({ confirmPassword: value })
        // this.props.resetValidation({ fieldName: "password" })
    }
    handleSubmit = (e: FormEvent) => {
        console.log("submit", this.state)
        this.props.submitPassword(this.state.password)
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
    }

    render() {
        // const { isValidating, validationResult } = this.props
        // let validationFailed = typeof validationResult !== 'undefined' && !validationResult.success && !validationResult.isError

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
                            <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                                <Card width="100%" align="center" minHeight="225px" padding="2em 12em 2em 8em">
                                    <Text fontSize="14px">Create a Password</Text>
                                    <Input value={this.state.password} name="password" onChange={this.handleChange} placeholder="Password" 
                                       type="password" margin="1em 0 1em 0" padding="0 1em 0 1em"  autoFocus={true} /> 
                                    <Text fontSize="14px">Confirm Password</Text>
                                    <Input value={this.state.confirmPassword} name="confirmPassword" onChange={this.handleChange} placeholder="Password" 
                                       type="password" margin="1em 0 1em 0" padding="0 1em 0 1em"  autoFocus={true} /> 
                                    {/* {
                                        validationFailed
                                            ? (typeof validationResult !== 'undefined' ? validationResult.validationMessages : []).map((e, i) => <Text align="center" color="#e30429" key={i}>{e}</Text>)
                                            : <></>
                                    } */}
                                </Card>
                            </Box>
                            <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                                <ArrowButton label="Continue" type="submit"  />
                                {/* {
                                    isValidating ? <div>show spinner</div> : <></>
                                } */}
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}


