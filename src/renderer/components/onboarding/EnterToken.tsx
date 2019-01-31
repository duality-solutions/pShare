import React, { ChangeEvent, ClipboardEvent, Component } from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";

export interface EnterTokenStateProps {

}
export interface EnterTokenDispatchProps {
    enterToken : () => void 
}
type EnterTokenProps = EnterTokenDispatchProps & EnterTokenStateProps

interface EnterTokenComponentStateProps {
    token: Array<any>
}

export class EnterToken extends Component<EnterTokenProps, EnterTokenComponentStateProps> {
    constructor(props: EnterTokenProps) {
        super(props)
        this.state = {
            token: ['','','','','','']
        }
    }
    
    handlePaste = (e : ClipboardEvent<HTMLDivElement>) => {
        console.log('paste is observed: ', e.clipboardData.getData('Text'))
        let clipboardData = e.clipboardData.getData('Text')
        let token = clipboardData.split("")
        if(clipboardData.length === 6){
            this.setState({ token })
        }
    }

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     let token = this.state.token
        let index:number = parseInt(e.target.name) // parsed out of index name
        let value: string = e.target.value.slice(-1)
        console.log('index:',index, 'value:',value)
        token[index] = value
        console.log(token)
        this.setState({ token })
    }

    handleSubmit = () => {
        console.log(this.state.token.join(""))
    }
    render() {
        return(
            <>
            <div onPaste={this.handlePaste}>
            <form onSubmit={()=>{}}>
            <Box width="100%" margin="2em 0 -1.5em 0" align="center">
                <AppLogo src={logo} width="100px" height="120px"/>
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
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="0" value={this.state.token[0]} onChange={this.handleChange} />
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="1" value={this.state.token[1]} onChange={this.handleChange} />
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="2" value={this.state.token[2]} onChange={this.handleChange} />
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="3" value={this.state.token[3]} onChange={this.handleChange} />
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="4" value={this.state.token[4]} onChange={this.handleChange} />
                    <Input type="text" width="8%" margin="1em 0.5em 1em 0" padding="0 1em 0 1em" 
                            name="5" value={this.state.token[5]} onChange={this.handleChange} />
                </Card>
            </Box>  
            <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
            <ArrowButton label="Continue" onClick={()=>{this.props.enterToken()}}/>
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


/**
 * 
 * 

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

   
        <H1 align="center" colored fontWeight="600">Create Account</H1>
                <Container height="50vh" margin="10% 0 0 0">
                    <form onSubmit={this.handleSubmit}>
                        <Box direction="column" align="center" width="100%">
                            <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
                                <Card width="100%" align="center" minHeight="225px" padding="2em 12em 2em 8em">
                                    <Text fontSize="14px">Enter a display name</Text>
                                    <Input value={this.state.displayname} onChange={this.handleChange} placeholder="Display name" margin="1em 0 1em 0" padding="0 1em 0 1em" />
                                    {
                                        validationFailed
                                            ? (typeof validationResult !== 'undefined' ? validationResult.errors : []).map((e,i) => <div key={i}>{e}</div>)
                                            : <></>
                                    }
                                </Card>
                            </Box>
                            <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
                                <ArrowButton label="Continue" type="submit"  disabled={isValidating}/>
                                {
                                    isValidating ? <div>show spinner</div> : <></>
                                }
                            </Box>
                        </Box>
                    </form>
                </Container>
        </>
    }
}



 */