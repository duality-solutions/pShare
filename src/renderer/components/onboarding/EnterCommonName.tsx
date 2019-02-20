import React, { ChangeEvent, Component, FormEvent } from "react";
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
import { NamedValue } from "../../../shared/system/validator/NamedValue";
import { validationScopes } from "../../reducers/validationScopes";

export interface EnterCommonNameStateProps {
    commonName: string
    isValidating: boolean,
    validationResult?: ValidationResult<string>

}
export interface EnterCommonNameDispatchProps {
    submitCommonName: (commonName: string) => void,
    resetValidationForField: (validationPayload: NamedValue<void>) => void
}
type EnterCommonNameProps = EnterCommonNameDispatchProps & EnterCommonNameStateProps

interface EnterCommonNameComponentState {
    commonName: string,
}
export class EnterCommonName extends Component<EnterCommonNameProps, EnterCommonNameComponentState>{
    constructor(props: EnterCommonNameProps) {
        super(props)
        this.state = { commonName: props.commonName }
    }
    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ commonName: e.target.value })
        this.props.resetValidationForField({scope:validationScopes.bdapAccount, name: "commonName" })
    }
    handleSubmit = (e: FormEvent) => {
        console.log("submit", this.state)
        this.props.submitCommonName(this.state.commonName)
        //if we don't prevent form submission, causes a browser reload
        e.preventDefault()
    }

    render() {
        const { isValidating, validationResult } = this.props
        let validationFailed = typeof validationResult !== 'undefined' && !validationResult.success && !validationResult.isError

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
                                    <Text fontSize="14px">Enter a display name</Text>
                                    <Input value={this.state.commonName} onChange={this.handleChange} placeholder="Display name"
                                        margin="1em 0 1em 0" padding="0 1em 0 1em" error={validationFailed} autoFocus={true} />
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
                    </form>
                </Container>
            </CSSTransitionGroup>
        </>
    }
}


