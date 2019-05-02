import React, { ChangeEvent, ClipboardEvent, Component, createRef, FormEvent } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import { ValidationResult } from "../../../shared/system/validator/ValidationResult";
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton, BackButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";
import { validationScopes } from "../../reducers/validationScopes";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { OnboardingActions } from "../../../shared/actions/onboarding";

export interface EnterTokenStateProps {
    token: string,
    isValidating: boolean,
    validationResult?: ValidationResult<string>
}

export type EnterTokenDispatchProps = PickedDispatchProps<typeof OnboardingActions, "resetValidationForField" | "submitToken" | "tokenCancelled">

type EnterTokenProps = EnterTokenDispatchProps & EnterTokenStateProps

interface EnterTokenComponentStateProps {
    token: Array<string>
}

export class EnterToken extends Component<EnterTokenProps, EnterTokenComponentStateProps> {
    constructor(props: EnterTokenProps) {
        super(props)
        this.state = {
            token: ['', '', '', '', '', '']
        }
    }

    private ref0 = createRef<HTMLInputElement>()
    private ref1 = createRef<HTMLInputElement>()
    private ref2 = createRef<HTMLInputElement>()
    private ref3 = createRef<HTMLInputElement>()
    private ref4 = createRef<HTMLInputElement>()
    private ref5 = createRef<HTMLInputElement>()

    handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        console.log('paste is observed: ', e.clipboardData.getData('Text'))
        this.props.resetValidationForField({ scope: validationScopes.bdapAccount, name: "token" })
        let token = e.clipboardData.getData('Text').split("")
        if (token.length === 6 && this.ref5.current) {
            this.setState({ token })
            this.ref5.current.focus()
        }
    }

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.resetValidationForField({ scope: validationScopes.bdapAccount, name: "token" })
        let token = this.state.token
        let index: number = parseInt(e.target.name) // parsed out of index name
        let value: string = e.target.value.slice(-1)
        console.log(value)
        token[index] = value
        this.setState({ token })
        console.log(token)
        if (token[index].length === 0) console.log('asdf')
        if (this.ref1.current && index === 0) {
            if (token[index].length !== 0)
                this.ref1.current.focus()
        }
        else if (this.ref2.current && index === 1) {
            if (token[index].length === 0 && this.ref0.current) {
                this.ref0.current.focus()
            } else
                this.ref2.current.focus()
        }
        else if (this.ref3.current && index === 2) {
            if (token[index].length === 0 && this.ref1.current) {
                this.ref1.current.focus()
            } else
                this.ref3.current.focus()
        }
        else if (this.ref4.current && index === 3) {
            if (token[index].length === 0 && this.ref2.current) {
                this.ref2.current.focus()
            } else
                this.ref4.current.focus()
        }
        else if (this.ref5.current && index === 4) {
            if (token[index].length === 0 && this.ref3.current) {
                this.ref3.current.focus()
            } else
                this.ref5.current.focus()
        }
        else if (this.ref4.current && index === 5) {
            if (token[index].length === 0) this.ref4.current.focus()
        }

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
                                    <BackButton onClick={() => this.props.tokenCancelled()} margin="90px 0 0 -120px"/>
                                        <Card width="100%" align="center" minHeight="225px" padding="2em 8em 2em 8em">
                                            <Text fontSize="14px">Enter Token</Text>
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref0} autoFocus
                                                name="0" value={this.state.token[0]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref1}
                                                name="1" value={this.state.token[1]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref2}
                                                name="2" value={this.state.token[2]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref3}
                                                name="3" value={this.state.token[3]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref4}
                                                name="4" value={this.state.token[4]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            <Input type="text" width="12%" margin="1em 0.5em 1em 0" fontSize="150%" ref={this.ref5}
                                                name="5" value={this.state.token[5]} onChange={this.handleChange} align="center"
                                                error={validationFailed} />
                                            {
                                                validationFailed
                                                    ? (typeof validationResult !== 'undefined' ? validationResult.validationMessages : []).map((e, i) => <Text margin="1em 0" color="#e30429" key={i}>{e}</Text>)
                                                    : <></>
                                            }
                                            <Box width="392px" background="#fafafa" padding="10px" borderRadius="5px">
                                                {/* <Text margin="0" color="#4a4a4a" align="center">Note: </Text> */}
                                                <Text margin="0" color="#4a4a4a" align="center">Enter your six character activation token above. Don't have a token?&nbsp; Create and verify a pShare
                                                account online to get your activation token: </Text>
                                                <Text align="center">
                                                    <span onClick={(event) => {
                                                        event.preventDefault();
                                                        let link = "https://pshare.duality.solutions";
                                                        require("electron").shell.openExternal(link);
                                                    }}
                                                        style={{ cursor: 'pointer', color: '#2e77d0' }}
                                                    >pshare.duality.solutions/register</span></Text>
                                            </Box>
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

