import React, { Component, ChangeEvent, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";
import { ValidationResult } from "../../../shared/system/validator/ValidationResult";

export interface EnterDisplaynameStateProps {
    displayname: string
    isValidating: boolean,
    validationResult?: ValidationResult<string>

}
export interface EnterDisplaynameDispatchProps {
    submitDisplayname: (displayname: string) => void
}
type EnterDisplayNameProps = EnterDisplaynameDispatchProps & EnterDisplaynameStateProps

interface EnterDisplayNameComponentState {
    displayname: string
}
export class EnterDisplayName extends Component<EnterDisplayNameProps, EnterDisplayNameComponentState>{
    constructor(props: EnterDisplayNameProps) {
        super(props)
        this.state = { displayname: props.displayname }
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ displayname: e.target.value })
    }
    handleSubmit = (e: FormEvent) => {
        console.log("submit", this.state)
        this.props.submitDisplayname(this.state.displayname)
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
    }

    render() {
        const { isValidating, validationResult } = this.props
        const validationFailed = typeof validationResult !== 'undefined' && !validationResult.success

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
                            <Box direction="column" width="50%" align="start" margin="0 auto 0 auto">
                                <Card width="100%" align="center" minHeight="225px" padding="2em 12em 2em 8em">
                                    <Text fontSize="14px">Enter a display name</Text>
                                    <Input value={this.state.displayname} onChange={this.handleChange} placeholder="Display name" margin="1em 0 1em 0" padding="0 1em 0 1em" />
                                    {
                                        validationFailed
                                            ? (typeof validationResult !== 'undefined' ? validationResult.errors : []).map(e => <div>{e}</div>)
                                            : <></>
                                    }
                                </Card>
                            </Box>
                            <Box direction="column" width="50%" align="right" margin="0 auto 0 auto">
                                <ArrowButton label="Continue" type="submit"  disabled={isValidating}/>
                                {
                                    isValidating ? <div>show spinner</div> : <></>
                                }
                            </Box>
                        </Box>
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}


