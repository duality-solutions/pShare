import React, { ChangeEvent, ClipboardEvent, Component, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";
import { ValidationPayload } from "../../../shared/system/validator/ValueValidationPayload";

export interface EnterTokenStateProps {
    token: string,
    isValidating: boolean,
    validationResult?: ValidationResult<string>
}
export interface EnterTokenDispatchProps {
    submitToken: (token: string) => void,
    resetValidation: (validationPayload: ValidationPayload<void>) => void
}
type EnterTokenProps = EnterTokenDispatchProps & EnterTokenStateProps

interface EnterTokenComponentStateProps {
    token: Array<string>
}

export class EnterToken extends Component<EnterTokenProps, EnterTokenComponentStateProps> {
    constructor(props: EnterTokenProps) {
        super(props)
        this.state = {
            token: [...props.token]
            //  this.state = { displayname: props.displayname }
        }
    }

    handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        console.log('paste is observed: ', e.clipboardData.getData('Text'))
        this.props.resetValidation({ fieldName: "token" })
        let clipboardData = e.clipboardData.getData('Text')
        let token = clipboardData.split("")
        if (clipboardData.length === 6) {
            this.setState({ token })
        }
    }

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.resetValidation({ fieldName: "token" })
        let token = this.state.token
        let index: number = parseInt(e.target.name) // parsed out of index name
        let value: string = e.target.value.slice(-1)
        console.log('index:', index, 'value:', value)
        token[index] = value
        console.log(token)
        this.setState({ token })
    }

    handleSubmit = (e: FormEvent) => {
        console.log('submit token: ', this.state.token.join(""))
        this.props.submitToken(this.state.token.join(""))
        e.preventDefault()
    }
    render() {
        const { isValidating, validationResult } = this.props
        const validationFailed = typeof validationResult !== 'undefined' && !validationResult.success

        return (
            <>
                <div onPaste={this.handlePaste}>
                    <form onSubmit={this.handleSubmit}>
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
                            <Container height="50vh" margin="10% 0 0 0" >
                                <Box direction="column" align="center" width="100%">
                                    <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                                        <Card width="100%" align="center" minHeight="225px" padding="2em 8em 2em 8em">
                                            <Text fontSize="14px">Enter Token</Text>
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="0" value={this.state.token[0]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="1" value={this.state.token[1]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="2" value={this.state.token[2]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="3" value={this.state.token[3]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="4" value={this.state.token[4]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%"
                                                name="5" value={this.state.token[5]} onChange={this.handleChange} align="center" error={validationFailed} />
                                            {
                                                validationFailed
                                                    ? (typeof validationResult !== 'undefined' ? validationResult.validationMessages : []).map((e, i) => <Text align="center" color="#e30429" key={i}>{e}</Text>)
                                                    : <></>
                                            }
                                        </Card>
                                    </Box>
                                    <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                                        <ArrowButton label="Continue" type="submit" disabled={isValidating} />
                                        {
                                            isValidating ? <div>show spinner</div> : <></>
                                        }

                                    </Box>
                                </Box>
                            </Container>
                        </CSSTransitionGroup>
                    </form>
                </div>
            </>
        )
    }
}

