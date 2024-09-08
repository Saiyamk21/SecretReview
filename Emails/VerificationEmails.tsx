import { Html,Head,Font,Preview,Heading,Row,Section,Text,Button } from "@react-email/components";

interface VerificationEmailProps{
    username:String;
    otp:string;
}

export default function VerificationEmail({username,otp}
    :VerificationEmailProps){
        return (
            <Html lang="en" dir="ltr">
                <Head>
                    <title>Verification Code</title>
                </Head>
                <Preview>Here&apos;a your verification code{otp}</Preview>
                <Section>
                    <Row>
                       <Heading>Hello {username}</Heading>
                    </Row>
                    <Row>
                        <Text>
                            Thank you for regr.PLease use this verification code to complete verificction
                        </Text>
                    </Row>
                    <Row>
                        <Text>{otp}</Text>
                    </Row>
                </Section>
            </Html>
          );
    }