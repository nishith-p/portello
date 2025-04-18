'use client';

import { Anchor, Box, Container, List, Paper, Stack, Table, Text, Title } from '@mantine/core';
import styles from './Privacy-policy.module.css';

export default function PrivacyPolicy() {
  return (
    <Container size="lg" className={styles.container}>
      <Stack>
        <Title order={1} className={styles.title}>
          Privacy and Cookie Policy
        </Title>

        <Text size="sm" className={styles.lastUpdated}>
          Last Updated: 12th August 2024
        </Text>

        <Box my="lg">
          <Text className={styles.paragraph}>
            This privacy- and cookie policy (the <strong>"Privacy and Cookie Policy"</strong>)
            governs the way <strong>AIESEC LIMITED (AIESEC in Sri Lanka)</strong>, registered as a
            Guarantee Limited Company registered under the companies act No 7 of 2007 (Sri Lankan
            Law) and having its registered office at{' '}
            <strong>No 102, Nahagawatte Road, Maharagama, Sri Lanka</strong> (
            <strong>"AIESEC", "we", "us",</strong> or <strong>"our"</strong>), as data controller,
            processes (collects, uses, maintains and discloses) your personal data in relation to
            the{' '}
            <Anchor href="http://aiesec.lk" className={styles.link} target="_blank">
              aiesec.lk
            </Anchor>{' '}
            websites ("<strong>Sites</strong>") and in relation to the services we provide through
            these Sites. For any other website affiliated with AIESEC, please refer to their
            respective privacy policy. As you read our Privacy and Cookie Policy, keep in mind that
            it applies to all AIESEC services available on our Sites unless otherwise indicated.
          </Text>

          <Text className={styles.paragraph}>
            Please refer to the following definitions that will be used in the document:
          </Text>

          <List className={styles.list}>
            <List.Item className={styles.listItem}>
              "<strong>Active User</strong>": A user who completed his or her profile and has logged
              into the website in the past 6 months or a user who is on an Exchange Experience.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Customers</strong>": users that sign up and/or find an Opportunity and go on
              exchange via our Platform.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Exchange Experiences</strong>": The service that is being offered on the
              Platform. A social or professional work experience in the organization of an
              Opportunity Provider.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Members</strong>": all persons who are (voluntarily) working for or on behalf
              of AIESEC.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Opportunity Listings</strong>": The posting and description of an opportunity
              that a user can apply to for an Exchange Experience.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Opportunity Providers</strong>": Organizations and other third parties that
              offer Exchange Experiences on our Platform.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Partners</strong>": users that offer Opportunities on our Platform.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Platform</strong>": our platform on the Sites to which a user may register as
              Opportunity Provider, Customer, or Member for the purpose of offering or engaging in
              Opportunities.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Profile Preferences</strong>": The Preferences section can be accessed by
              clicking the icon in the left bottom in the{' '}
              <Anchor href="http://aiesec.lk" className={styles.link} target="_blank">
                aiesec.lk
              </Anchor>{' '}
              home page where the user manages consent of use of personal data. Furthermore, this
              can be customized by clicking the Customize button in the Cookie Banner and Policy
              which will be shown when you visit the website.
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>Review</strong>": A public review about an Exchange Experience that includes
              a rating on a scale from 1-10 ("<strong>Rating</strong>").
            </List.Item>
            <List.Item className={styles.listItem}>
              "<strong>User</strong>": all users of the Platform, both Opportunity Providers and
              Customers.
            </List.Item>
          </List>

          <Text className={styles.paragraph}>
            To the extent that we process personal data of individuals located in the European
            Economic Area and the United Kingdom in relation to the offering of goods or services to
            these individuals or the monitoring of their behaviour, this Privacy and Cookie Policy
            contains the information required to be conveyed to these individuals pursuant to the
            European Union's general data protection regulation (the "<strong>EU GDPR</strong>") as
            applicable in the European Economic Area ("<strong>EEA</strong>") and as retained in the
            laws of the United Kingdom further to the European Union (Withdrawal) Act 2018 (the "
            <strong>UK GDPR</strong>" and, together with the EU GDPR, the "<strong>GDPR</strong>
            ").For the purposes of article 27 of the EU GDPR, our representative in the European
            Union is Stichting AIESEC International (Rijn 12 85272491BG 's-Gravenhage, The
            Netherlands). For the purpose of article 27 of the UK GDPR, our representative in the
            United Kingdom is A.I.E.S.E.C. (U.K.) LIMITED (Allia Future Business Centre, 18-20
            London Lane, London, England, E8 3PR;{' '}
            <Anchor href="mailto:dataprotection@aiesec.co.uk" className={styles.link}>
              dataprotection@aiesec.co.uk
            </Anchor>
            ).
          </Text>
        </Box>

        <Title order={2} className={styles.subtitle}>
          1. Information we collect
        </Title>

        <Text className={styles.paragraph}>
          Our Platform aims to connect Opportunity Providers with Members and Active Users in the
          context of Exchange Experiences. Our Platform is accessible via our Sites. There are three
          general categories of how we collect information about our Members, Customers, Partners
          and visitors to our Sites.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          1.1 Information You Give Us
        </Title>

        <Text className={styles.paragraph}>
          We collect information you share with us when you use the AIESEC Platform.
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            <strong>Account Information.</strong> When you sign up for an AIESEC Account, we require
            certain information such as your name, email address, phone number, country of
            residence, and date of birth.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Profile Information.</strong> To use certain features within the AIESEC
            Platform, we may also ask you to complete a profile, which may include your skills and
            qualifications, professional activities, personal details, academic curriculum,
            professional adequacy, professional experience, membership of professional committees,
            current employment information, image recordings, and gender. For support in
            visa-processing, we might require a copy of the passport. Sensitive data not required
            for the visa process (such as national social security numbers) will be blacklined. As
            an Active User, you can approach Opportunity Providers via your profile. By default,
            your public profile will be anonymous. If you are an Active User you may consent to
            include certain parts of your profile (like your profile picture, first name, and
            qualifications) as part of your public profile page, making it publicly visible to
            others and allowing Opportunity Providers to approach you directly. You can choose to
            opt-in by enabling{' '}
            <strong>
              <em>POP Profile Visibility</em>
            </strong>{' '}
            in your <strong>Profile Preferences</strong>. You may be free to withdraw your consent
            at any time by disabling the same in your Profile Preferences.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Payment Information.</strong> We collect your financial information (like your
            bank account or credit card information) when you use Payment Services to process
            payments.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Communications with AIESEC and other Users.</strong> When you communicate with
            AIESEC or use the AIESEC Platform to communicate with other Users, we collect
            information about the time and date of your communication to research and gain insight
            into our Users' use of the communication feature and to determine whether any open
            queries have not been followed up by AIESEC. Our Platform offers a chat function for
            communication purposes, which is secured by our service provider Amazon Webs services.
            Only selected employees of AIESEC International and of our IT vendor Commutatus to have
            access to the database. The chat feature includes multiple conversations that can
            include multiple people: Partner representatives and AIESEC representatives, if their
            participation is needed to ensure, manage and/or process the application. AIESEC ensures
            that you are always aware of who is included in the conversation. All messages are
            secured at database-level by encryption.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Other Information.</strong> You may otherwise choose to provide us information
            when you fill in a form, conduct a search, update or add information to your AIESEC
            Account, respond to surveys, post to community forums, participate in promotions, email
            us or use other features of the AIESEC Platform.
          </List.Item>
        </List>

        <Title order={3} className={styles.subsubtitle}>
          1.2 Information We Automatically Collect from Your Use of the AIESEC Platform
        </Title>

        <Text className={styles.paragraph}>
          When you use the AIESEC Platform, we collect information about the services you use and
          how you use them.
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            <strong>Usage Information.</strong> We collect information about your interactions with
            the AIESEC Platform, such as the pages or other content you view, your searches for
            Opportunity Listings, applications you have sent, and other actions on the AIESEC
            Platform.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Location Information.</strong> When you use certain features of the AIESEC
            Platform, we may collect different types of information about your IP address (such as
            your location).
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Log Data.</strong> We automatically collect log information when you use the
            AIESEC Platform, even if you have not created an AIESEC Account or logged in. That
            information includes, among other things: details about how you've used the AIESEC
            Platform (including links to third party applications), IP address, access times,
            hardware and software information, device information, device event information (e.g.,
            crashes, browser type), and the page you've viewed or engaged with before or after using
            the AIESEC Platform.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Transaction Information.</strong> We collect information related to your
            transactions on the AIESEC Platform, including the date and time, amounts charged, and
            other related transaction details.
          </List.Item>
          <List.Item className={styles.listItem}>
            <strong>Cookies and Similar Technologies.</strong> We use cookies and other similar
            technologies, such as web beacons, pixels, and mobile identifiers subject to, when this
            is not strictly necessary for operating our website, obtaining your consent before
            collecting information through cookies stored on your terminal equipment and information
            obtained from your terminal equipment. Subject to the same qualification, we may also
            allow our Partners to use these tracking technologies on the AIESEC Platform, or engage
            others to track your behavior on our behalf. You may disable performance and/or
            marketing cookies using the Cookies control panel. You may alternatively disable the
            usage of cookies through your browser settings. An HTTP header "Do Not Track" signal
            will however not operate. For further information about the use of cookies, please be
            referred to paragraph 9 of this Privacy- and Cookie Policy.
          </List.Item>
        </List>

        <Title order={3} className={styles.subsubtitle}>
          1.3 Information We Collect from Third Parties
        </Title>

        <Text className={styles.paragraph}>
          We collect information that others provide about you when they use the AIESEC Platform, or
          obtain information from other sources and combine that with information we collect through
          the AIESEC Platform.
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            <strong>Third Party Services.</strong> If you link, connect, or login to your AIESEC
            Account with a third party service (e.g., Facebook, LinkedIn), the third party service
            may send us information such as your registration and profile information from that
            service. This information varies and is controlled by that service or as authorized by
            you via your privacy settings at that service.
          </List.Item>
        </List>

        <Title order={2} className={styles.subtitle}>
          2. How we use information we collect
        </Title>

        <Title order={3} className={styles.subsubtitle}>
          2.1 Purposes and legal grounds for processing
        </Title>

        <Text className={styles.paragraph}>
          We use your personal data only for the following purposes or purposes compatible therewith
          and pursuant to the following legal bases under the GDPR (the legal basis identified at
          the top of each column applies to the purposes set forth in that column):
        </Text>

        <div className={styles.tableContainer}>
          <Table className={styles.table}>
            <Table.Thead className={styles.tableHeader}>
              <Table.Tr>
                <Table.Th className={styles.tableHeaderCell}>
                  <Text fw={700}>TO PURSUE LEGITIMATE INTEREST</Text>
                  <Text size="sm">
                    (Data processing is necessary for the purposes of the legitimate interests
                    identified below)
                  </Text>
                </Table.Th>
                <Table.Th className={styles.tableHeaderCell}>
                  <Text fw={700}>CONSENT</Text>
                  <Text size="sm">(You have consented to the relevant data processing)</Text>
                </Table.Th>
                <Table.Th className={styles.tableHeaderCell}>
                  <Text fw={700}>CONTRACTUAL OBLIGATION/USER AGREEMENT</Text>
                  <Text size="sm">
                    (Data processing is necessary for the performance of a contract to which the
                    data subject is party or in order to take steps at the request of the data
                    subject prior to entering into a contract)
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your name and email address for our direct marketing activities
                  </Text>
                  <Text size="sm">
                    (only (i) for Active Users having purchased a similar service which we approach
                    by electronic communication, (ii) for anyone we approach otherwise than by
                    electronic communication, and (iii) for individuals representing Partners or
                    potential Partners) - it is necessary for the purposes of the legitimate
                    interests pursued by us in marketing our services.
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text></Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>We use your Account information to create an AIESEC account</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your Usage information (regarding the use of our Platform) for our
                    statistical research - it is necessary for the purposes of the legitimate
                    interests pursued by us in gaining insight on our market
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your contact details (name and email address) for direct marketing
                    purposes by electronic communications (for others than Active Users who
                    purchased similar services from us and individuals representing Partners or
                    potential Partners)
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your login data to enable you to access and use the AIESEC Platform.
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your contact details and the information you upload on your Profile for
                    our user management and account information administration (refer to 1.1) - it
                    is necessary for the purposes of the legitimate interests pursued by us in
                    ensuring and improving the quality, security and functionality of our service
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your Profile information to provide it to the Users of the POP Explore
                    Candidate Page (refer to 1.1)
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use Payment and Transaction information to carry out our payment services
                  </Text>
                  <Text>
                    We use Profile information to perform our services such as the Exchange
                    Experiences
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your Usage information and Log information to develop our services and
                    Sites, for example to personalize or otherwise customize your experience by,
                    among other things, ranking search results or showing featured opportunities
                    based on your search, application history, and preferences and to operate,
                    protect, improve and optimize the AIESEC Platform and experience, such as by
                    performing analytics and conducting research on the frequency of usage of our
                    features - it is necessary for the purposes of the legitimate interests pursued
                    by us in ensuring and improving the quality, security and functionality of our
                    service
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We collect and use the images of Users in their Profile to display them to
                    Opportunity Providers
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>We use your contact details to provide customer service</Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your contact details and Communication information to communicate with
                    you (such as to send you service or support messages, such as updates, security
                    alerts, and account notifications) - it is necessary for the purposes of the
                    legitimate interests pursued by us in ensuring and improving the quality,
                    security and functionality of our service
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We collect the following information through the use of the website and
                    (persistent) cookies to help us improve our products and performance, such as:
                    whether you are a recurring user and whether you are being tracked by Google
                    Analytics the websites.
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use a copy of your passport to identify you and to provide your visa services
                    (we will ensure that your social security number is blacklined)
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your contact details, Profile information, user data, and other personal
                    data we have from you to resolve any disputes with any of our Users and enforce
                    our agreements with third parties (for example to enforce our Terms &
                    Conditions, Payments Terms, and other policies) - it is necessary for the
                    purposes of the legitimate interests pursued by us of asserting our legal rights
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use cookies and tracking technologies to collect information t to show you
                    advertisements that are more relevant to you.
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    To provide our services we display age, nationality and professional experience
                    to potential Opportunity Providers to showcase your profile
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    We use your contact details and Profile information to regularly check our own
                    operations with an internal independent body. We randomly select Exchange
                    Experiences that were delivered on the Platform and get in touch with our
                    customers to verify that the information documented on our Platform is
                    reflecting what actually happened - it is necessary for the purposes of the
                    legitimate interests pursued by us in ensuring and improving the quality,
                    security and functionality of our service
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    To enter into or perform a contract with a Partner - it is necessary for the
                    purposes of the legitimate interests pursued by us in entering and performing
                    contracts with Partners and improving the quality, security and functionality of
                    our service
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    To generate statistical information, including in respect of your Location
                    information – it is necessary for the purposes of the legitimate interests
                    pursued by us in gaining insight on our market
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}>
                  <Text>
                    to preserve and defend our rights and assist law enforcement agencies as
                    required - it is necessary for the purposes of the legitimate interests pursued
                    by us of asserting our legal rights and/or the legitimate interests pursued by
                    law enforcement agencies
                  </Text>
                </Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>

        <Title order={2} className={styles.subtitle}>
          3. Sharing & Disclosure
        </Title>

        <Title order={3} className={styles.subsubtitle}>
          3.1 Sharing between Opportunity Providers and Exchange Participants
        </Title>

        <Text className={styles.paragraph}>
          To help facilitate the application process, we share your information with other Users as
          follows:
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            When you as an Exchange Participant apply for an Opportunity, certain (Profile)
            information (such as a copy of your passport, your photo, financial identification data,
            data regarding your professional activities, personal details, academic curriculum,
            professional adequacy, professional experience, membership of professional committees
            and current employment information) about you is shared with the Opportunity Provider,
            including your full name and your qualifications.
          </List.Item>
          <List.Item className={styles.listItem}>
            When you as an Opportunity Provider post your Opportunity Listing, certain information
            is shared with the Users to showcase your Opportunity and Organization.
          </List.Item>
          <List.Item className={styles.listItem}>
            When you as an Opportunity Provider accept an application to your Opportunity, certain
            information is shared with the Exchange Participant to facilitate the further process.
          </List.Item>
        </List>

        <Text className={styles.paragraph}>
          We do not share your billing and payout information with other Users.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          3.2 Profiles, Opportunity Listings, and other Public Information
        </Title>

        <Text className={styles.paragraph}>
          The Applications Platform let you publish information that is visible to selective groups
          of users. For example:
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            By default your public profile will be anonymous. If you are an Active User you may
            consent to include certain parts of your profile (like your profile picture, first name
            and qualifications) as part of your public profile page, making it publicly visible to
            others and allowing Opportunity Providers to approach you directly. You can choose to
            opt-in by enabling <em>POP Profile Visibility</em> in your{' '}
            <strong>Profile Preferences</strong>. You may be free to withdraw your consent at any
            time by disabling same in your Profile Preferences.
          </List.Item>
          <List.Item className={styles.listItem}>
            Opportunity Listings are publicly visible and include information such as the
            requirements or details about the Exchange Experiences, Opportunity Listing description,
            calendar availability and any additional information the Opportunity Provider chooses to
            share.
          </List.Item>
          <List.Item className={styles.listItem}>
            After completing an Exchange Experience, Exchange Participants write reviews and rate
            the Opportunity. Reviews are a part of your Opportunity Listings profile page.
          </List.Item>
          <List.Item className={styles.listItem}>
            If you submit content in a public forum or social media post, or use a similar feature
            on the AIESEC Platform, that content is publicly visible.
          </List.Item>
        </List>

        <Text className={styles.paragraph}>
          Information you share publicly on the AIESEC Platform can be indexed through third party
          search engines. In some cases, you may opt-out of this feature in your Account settings.
          If you change your settings or your public-facing content, these search engines may not
          update their databases. We do not control the practices of third party search engines, and
          they may use caches containing your outdated information.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          3.3 Service Providers
        </Title>

        <Text className={styles.paragraph}>
          We use a variety of third party service providers to help us provide services related to
          the AIESEC Platform, such as IT service providers (i.e. Commutatus, Intercom and
          Postmark), consultants and payment service providers. For example, service providers may
          help us to provide customer service, advertising, or payments services. These providers
          have limited access to your information and only in case this is necessary to perform
          these tasks on our behalf.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          3.3.1 Commutatus
        </Title>

        <Text className={styles.paragraph}>
          AIESEC International AIESEC LIMITED (AIESEC in Sri Lanka) employs Commutatus (Ground
          Floor, 43/44 Thapar House, Montieth Road, Egmore, Chennai, Tamil Nadu 600008, India) as
          their service provider for development and improvement of their Sites. As such, Commutatus
          staff have access to our user information on a database level for fulfilling their job
          responsibilities. All Commutatus staff are trained on Data Protection/Privacy standards.
          All code that is deployed to the server is only possible by authorized personnel.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          3.3.2 Intercom
        </Title>

        <Text className={styles.paragraph}>
          As a data processor acting on our behalf, Intercom analyzes your use of our website and/or
          product and tracks our relationship by way of cookies and similar technologies so that we
          can improve our service to you subject to obtaining your consent before collecting
          information through cookies stored on your terminal equipment and information obtained
          from your terminal equipment. We may also use Intercom as a medium for communications,
          either through email, or through messages within our product(s). As part of our service
          agreements and subject to the above qualification on obtaining your consent, Intercom
          collects publicly available contact and social information related to you, such as your
          email address, gender, company, job title, photos, website URLs, social network handles
          and physical addresses, to enhance your user experience.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          3.3.3 Postmark
        </Title>

        <Text className={styles.paragraph}>
          We use the transactional email service "Postmark" from Wildbit, 225 Chestnut St,
          Philadelphia, PA 19106, USA. If you use an offer on our website that requires the input of
          your e-mail address, it can be stored on the servers of Postmark. Postmark grants us
          access to this data. We use this to inform you about our work, future events, information
          about our products and innovations on the website.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          3.4 Safety and Compliance with Law
        </Title>

        <Text className={styles.paragraph}>
          AIESEC discloses your information to courts, law enforcement or governmental authorities,
          or authorized third parties, if and to the extent that we are required to do so by law or
          if such disclosure is reasonably necessary: (i) to comply with legal process and to
          respond to claims asserted against AIESEC, (ii) to respond to verified requests relating
          to a criminal investigation or alleged or suspected illegal activity or any other activity
          that may expose us, you, or any other of our Users to legal liability, (iii) to enforce
          and administer our <u>Terms & Conditions</u> or other agreements with Users, (iv) for
          fraud investigation and prevention, risk assessment, customer support, product development
          and debugging purposes, or (v) to protect the rights, property or personal safety of
          AIESEC, its employees, its Members, or members of the public.
        </Text>

        <Text className={styles.paragraph}>
          We will attempt to notify Users about these requests unless: (i) providing notice is
          prohibited by the legal process itself, by court order we receive, or by applicable law,
          or (ii) we believe that providing notice would be futile, ineffective, create a risk of
          injury or bodily harm to an individual or group, or create or increase a risk of fraud
          upon AIESEC's property, it's Users and the Platform (collectively, "Risk Scenarios"). In
          instances where we comply with legal requests without notice for these reasons, we will
          attempt to notify that Users about the request after the fact if we determine in good
          faith that we are no longer legally prohibited from doing so and that no Risk Scenarios
          apply.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          3.5 Corporate Affiliates
        </Title>

        <Text className={styles.paragraph}>
          We may share your information with AIESEC's affiliates and branches abroad when this is
          necessary to ensure that AIESEC is able to provide the Exchange Experiences (as required
          on the basis of AIESEC's contractual obligations). We will share your information with (i)
          the legal AIESEC entity in the country you are residing in (which you choose during the
          Account creation) or (ii) the legal AIESEC entity that the Opportunity you are applying is
          based. This concerns the following countries and territories:
        </Text>

        <div className={styles.gridContainer}>
          <div>Afghanistan</div>
          <div>Germany</div>
          <div>Norway</div>
          <div>Albania</div>
          <div>Ghana</div>
          <div>Oman</div>
          <div>Algeria</div>
          <div>Greece</div>
          <div>Pakistan</div>
          <div>Argentina</div>
          <div>Guatemala</div>
          <div>Panama</div>
          <div>Armenia</div>
          <div>Hong Kong</div>
          <div>Paraguay</div>
          <div>Australia</div>
          <div>Hungary</div>
          <div>Peru</div>
          <div>Austria</div>
          <div>Iceland</div>
          <div>Philippines</div>
          <div>Azerbaijan</div>
          <div>India</div>
          <div>Poland</div>
          <div>Bahrain</div>
          <div>Indonesia</div>
          <div>Portugal</div>
          <div>Bangladesh</div>
          <div>Ireland</div>
          <div>Puerto Rico</div>
          <div>Belarus</div>
          <div>Italy</div>
          <div>Romania</div>
          <div>Belgium</div>
          <div>Japan</div>
          <div>Russia</div>
          <div>Benin</div>
          <div>Jordan</div>
          <div>Rwanda</div>
          <div>Bolivia</div>
          <div>Kazakhstan</div>
          <div>Rwanda</div>
          <div>Bosnia Herzegovina</div>
          <div>Kenya</div>
          <div>Senegal</div>
          <div>Brazil</div>
          <div>Korea</div>
          <div>Serbia</div>
          <div>Bulgaria</div>
          <div>Kuwait</div>
          <div>Seychelles</div>
          <div>Burkina Faso</div>
          <div>Kyrgyzstan</div>
          <div>Singapore</div>
          <div>Cabo Verde</div>
          <div>Laos</div>
          <div>Slovakia</div>
          <div>Cambodia</div>
          <div>Latvia</div>
          <div>Slovenia</div>
          <div>Cameroon</div>
          <div>Lebanon</div>
          <div>South Africa</div>
          <div>Canada</div>
          <div>Liberia</div>
          <div>Spain</div>
          <div>Chile</div>
          <div>Lithuania</div>
          <div>Sri Lanka</div>
          <div>China, Mainland</div>
          <div>Macedonia</div>
          <div>Sweden</div>
          <div>Colombia</div>
          <div>Malawi</div>
          <div>Switzerland</div>
          <div>Costa Rica</div>
          <div>Malaysia</div>
          <div>Taiwan</div>
          <div>Cote D'Ivoire</div>
          <div>Malta</div>
          <div>Tajikistan</div>
          <div>Croatia</div>
          <div>Mauritius</div>
          <div>Tanzania</div>
          <div>Czech Republic</div>
          <div>Mexico</div>
          <div>Thailand</div>
          <div>Denmark</div>
          <div>Moldova</div>
          <div>The Netherlands</div>
          <div>Dominican Republic</div>
          <div>Mongolia</div>
          <div>Togo</div>
          <div>Ecuador</div>
          <div>Montenegro</div>
          <div>Tunisia</div>
          <div>Egypt</div>
          <div>Morocco</div>
          <div>Turkey</div>
          <div>El Salvador</div>
          <div>Mozambique</div>
          <div>Uganda</div>
          <div>Estonia</div>
          <div>Myanmar</div>
          <div>Ukraine</div>
          <div>Ethiopia</div>
          <div>Namibia</div>
          <div>United Arab Emirates</div>
          <div>Fiji</div>
          <div>Nepal</div>
          <div>United Kingdom</div>
          <div>Finland</div>
          <div>New Zealand</div>
          <div>United States</div>
          <div>France</div>
          <div>Nicaragua</div>
          <div>Uruguay</div>
          <div>Gabon</div>
          <div>Nigeria</div>
          <div>Venezuela</div>
          <div></div>
          <div></div>
          <div>Vietnam</div>
        </div>

        <Title order={3} className={styles.subsubtitle}>
          3.6. Operating globally
        </Title>

        <Text className={styles.paragraph}>
          As described in this Privacy- and Cookie Policy, we may sometimes share your information
          with affiliates or branches of AIESEC or with third parties. Individuals protected by the
          GDPR are informed that their personal information can be transferred outside the European
          Economic Area, in addition to Canada, the U.S.A. as well as other countries where such
          service providers are located. An adequacy decision from the European Commission pursuant
          to Directive 95/46/EC avails under article 45 of the GDPR in case of transfers to
          private-sector organisations in Canada governed by the Personal Information Protection and
          Electronic Documents Act as well as organisations in Andorra, Argentina, Faroe Islands,
          Guernsey, Israel, Isle of Man, Japan, Jersey, New Zealand, Switzerland and Uruguay, it is
          noted that the United Kingdom is expected to join this list shortly. In other cases
          involving processing of personal data of individuals in the EEA or the UK subject to the
          GDPR, unless one of the exemptions of article 49 of the GDPR avails, appropriate
          safeguards are in place in accordance with article 46 of the GDPR – namely standard
          contractual clauses as approved by the European Commission.
        </Text>

        <Text className={styles.paragraph}>
          You may get access to these agreements or request a copy thereof by sending an email to{' '}
          <Anchor href="mailto:im.srilanka@aiesec.net" className={styles.link}>
            im.srilanka@aiesec.net
          </Anchor>{' '}
          or{' '}
          <Anchor href="mailto:fouzul.hassan@aiesec.net" className={styles.link}>
            fouzul.hassan@aiesec.net
          </Anchor>
          .
        </Text>

        <Title order={2} className={styles.subtitle}>
          4. How long do we store your personal data?
        </Title>

        <Text className={styles.paragraph}>
          Your personal data will be stored no longer than necessary for the purposes for which they
          are collected. Only where we are legally obliged to, or where this is necessary for
          defending our interests in the context of judicial proceedings (e.g. in case of a
          dispute), we will store the personal data for a longer period of time.
        </Text>

        <Text className={styles.paragraph}>
          More specifically, the following storage periods apply in terms of personal data:
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            Account information (i.e contact details, age, nationality, location data, professional
            experiences): 24 months after the last activity or until the user deletes their account
          </List.Item>
          <List.Item className={styles.listItem}>
            Profile Information (i.e user data connected to an application): 24 months after last
            activity or until the user deletes their account
          </List.Item>
          <List.Item className={styles.listItem}>
            User behavior data of the logged user (i.e the user data connected to an action taken):
            24 months after last activity or until the user deletes their account
          </List.Item>
          <List.Item className={styles.listItem}>
            Aggregated data or logged user: 24 months after collection
          </List.Item>
          <List.Item className={styles.listItem}>
            Notification data of logged user: 24 months after last activity or until the user
            deletes their account
          </List.Item>
          <List.Item className={styles.listItem}>
            Payment information: 13 months as from the relevant payment transaction (expect for CSV
            number which is deleted after the payment transaction), it is noted that accounting
            data; accounting data can however kept for the required time period under Canadian Law.
          </List.Item>
          <List.Item className={styles.listItem}>
            Copy of your passport: 24 months after last activity or until the user deletes their
            account
          </List.Item>
          <List.Item className={styles.listItem}>
            Communication data: 24 months after last activity or until the user deletes their
            account
          </List.Item>
          <List.Item className={styles.listItem}>
            Contractual data: Inactive database 24 months after last activity or until the user
            deletes their account or any outstanding payment has been made (whichever the latest);
            after this time period, we will archive this information for the purposes of using it
            should we need it to assert our legal rights before an administrative or judiciary
            authority and keep it until the latest between the expiry of the applicable limitation
            period or the date a final decision is made which is not subject to any recourse.
          </List.Item>
        </List>

        <Title order={2} className={styles.subtitle}>
          5. Your rights
        </Title>

        <Title order={3} className={styles.subsubtitle}>
          5.1 Access and Update
        </Title>

        <Text className={styles.paragraph}>
          You may review, update or delete the information in your AIESEC Account by logging into
          your AIESEC Account and reviewing your Account settings and profile.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          5.2 Account Cancellation
        </Title>

        <Text className={styles.paragraph}>
          You may cancel your account at any time on our Site in the Profile Preferences section.
          Note that information that you have shared with others (like Reviews or forum postings)
          may continue to be publicly visible for up to 2 years (after last activity or until you
          delete your account) on the AIESEC Platform in association with your first name.
        </Text>

        <Text className={styles.paragraph}>
          Once your account is cancelled, we are removing any personal data attached to your user
          account (such as, but not limited to contact information). Instead, we will display
          anonymous identifiers to all our key stakeholders. All business critical information, such
          as statistical data connected to applications you may have created on the Platform will be
          retained in such an anonymous way.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          5.3 What are your rights and how you can exercise them?
        </Title>

        <Text className={styles.paragraph}>Under the GDPR, data subjects have the right to:</Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            information about and access to their personal data;
          </List.Item>
          <List.Item className={styles.listItem}>rectify their personal data;</List.Item>
          <List.Item className={styles.listItem}>
            erasure of their personal data ('right to be forgotten') in limited circumstances;
          </List.Item>
          <List.Item className={styles.listItem}>
            restriction of processing of their personal data in limited circumstances;
          </List.Item>
          <List.Item className={styles.listItem}>
            object to the processing of their personal data based on legitimate interests, in the
            absence of compelling grounds for continuing such processing (including the right to
            object to processing for direct marketing purposes);
          </List.Item>
          <List.Item className={styles.listItem}>
            receive their personal data in a structured, commonly used and machine readable format
            and to (have) transmit(ted) your personal data to another organization.
          </List.Item>
        </List>

        <Text className={styles.paragraph}>
          Although we are required by the GDPR to grant these rights only to individuals in the
          European Economic Area and the United Kingdom and only in respect of processing activities
          relating to the offering of goods or services to these individuals or the monitoring of
          their behaviour, we are keen to treat equally all our Customers.
        </Text>

        <Text className={styles.paragraph}>
          You may request your personal information held by us on the Platform in your Profile
          Preferences in the Download Personal Data section. We will provide you with a copy of the
          personal information held by us as soon as possible and will respond to your request
          within one month; that period may be extended by two further months where necessary,
          taking into account the complexity and number of the requests.
        </Text>

        <Text className={styles.paragraph}>
          Requests in this section should be addressed to:{' '}
          <Anchor href="mailto:im.srilanka@aiesec.net" className={styles.link}>
            im.srilanka@aiesec.net
          </Anchor>{' '}
          or{' '}
          <Anchor href="mailto:fouzul.hassan@aiesec.net" className={styles.link}>
            fouzul.hassan@aiesec.net
          </Anchor>
          . AIESEC will handle the aforementioned requests within a period of 3 months.
        </Text>

        <Text className={styles.paragraph}>
          Finally, you have the right to lodge a complaint with the relevant data protection
          authority relating to the processing of your personal data by AIESEC.
        </Text>

        <Title order={2} className={styles.subtitle}>
          6. Security
        </Title>

        <Text className={styles.paragraph}>
          We are continuously implementing and updating administrative, technical, and physical
          security measures to help protect your information against unauthorized access, loss,
          destruction, or alteration. However, the Internet is not a 100% secure environment so we
          can not guarantee the security of the transmission or storage of your information.
        </Text>

        <Text className={styles.paragraph}>
          More specifically, we have taken the following measures:
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            <strong>Authentication</strong> system through a separate authentication server and
            database disconnected from the remaining website server and database
          </List.Item>
          <List.Item className={styles.listItem}>Confidentiality training</List.Item>
          <List.Item className={styles.listItem}>
            Deployment of new code to the system only possible by authorized personnel of Commutatus
          </List.Item>
          <List.Item className={styles.listItem}>
            Servers and databases are on a virtual private cloud that restricts access only to users
            that have access to the cloud through the usage of private keys.
          </List.Item>
          <List.Item className={styles.listItem}>
            Contingency plan is in place for the event of a private key being compromised.
          </List.Item>
          <List.Item className={styles.listItem}>
            Storage of access logs for databases, API and authentication for up to 7 days.
          </List.Item>
          <List.Item className={styles.listItem}>
            Monitoring systems allow for routine manual checks.
          </List.Item>
          <List.Item className={styles.listItem}>Periodically backup of the database.</List.Item>
          <List.Item className={styles.listItem}>
            Read more about our cloud provider (Amazon Web Services) here:{' '}
            <Anchor href="https://aws.amazon.com/security/" className={styles.link} target="_blank">
              https://aws.amazon.com/security/
            </Anchor>
          </List.Item>
        </List>

        <Text className={styles.paragraph}>
          Further, we seek to ensure that we keep your personal data accurate and up to date. In
          view thereof, we kindly request you to inform us of any changes to your personal data
          (such as a change in your contact details).
        </Text>

        <Title order={2} className={styles.subtitle}>
          7. Use of cookies
        </Title>

        <Text className={styles.paragraph}>
          AIESEC uses "cookies" in conjunction with the Platform to obtain information. A cookie is
          a small data file that is transferred to your device (e.g. your phone or your computer)
          for record-keeping purposes. For example, a cookie could allow the Platform to recognize
          your browser, while another could store your preferences and other information.
        </Text>

        <Text className={styles.paragraph}>
          There are two types of cookies used on the Platform, namely "persistent cookies" and
          "session cookies". Session cookies will normally expire when you close your browser, while
          persistent cookies will remain on your device after you close your browser, and can be
          used again the next time you access the Platform.
        </Text>

        <Text className={styles.paragraph}>
          Your browser may allow you to set how it handles cookies, such as declining all cookies or
          prompting you to decide whether to accept each cookie. But please note that some parts of
          the Platform may not work as intended or may not work at all without cookies.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          Disabling cookies
        </Title>

        <Text className={styles.paragraph}>
          You may disable performance and/or marketing cookies using the Cookies control panel.
          Alternatively, you can modify your browser setting to decline specific cookies by visiting
          the Help portion of your browser's toolbar. If you choose to decline cookies, please note
          that you may not be able to sign in, customize, or use some of the interactive features of
          the Platform.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          Other technologies
        </Title>

        <Text className={styles.paragraph}>
          We also use other technologies with similar functionality to cookies on the Platform, such
          as web beacons and tracking URLs to obtain Log Data about Users, subject to, when this is
          not strictly necessary for operating our website, obtaining your consent before collecting
          information through cookies stored on your terminal equipment and information obtained
          from your terminal equipment. We also use web beacons and tracking URLs in our messages to
          you to determine whether you have opened a certain message or accessed a certain link,
          subject to the same qualification.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          7.1 AIESEC cookies
        </Title>

        <Text className={styles.paragraph}>
          <strong>Strictly necessary cookies</strong>. We use cookies that are strictly necessary to
          operate our website without your specific consent, including:
        </Text>

        <List className={styles.list}>
          <List.Item className={styles.listItem}>
            user‑input cookies (session-id) such as first‑party cookies to keep track of the user's
            input when filling online forms, shopping carts, etc., for the duration of a session or
            persistent cookies limited to a few hours in some cases;
          </List.Item>
          <List.Item className={styles.listItem}>
            authentication cookies, to identify the user once he has logged in, for the duration of
            a session;
          </List.Item>
          <List.Item className={styles.listItem}>
            user‑centric security cookies, used to detect authentication abuses, for a limited
            persistent duration;
          </List.Item>
          <List.Item className={styles.listItem}>
            multimedia content player cookies, used to store technical data to play back video or
            audio content, for the duration of a session;
          </List.Item>
          <List.Item className={styles.listItem}>
            load‑balancing cookies, for the duration of session;
          </List.Item>
          <List.Item className={styles.listItem}>
            user‑interface customisation cookies such as language or font preferences, for the
            duration of a session (or slightly longer);
          </List.Item>
          <List.Item className={styles.listItem}>
            third‑party social plug‑in content‑sharing cookies, for logged‑in members of a social
            network.
          </List.Item>
        </List>

        <Text className={styles.paragraph}>
          <strong>Performance cookies.</strong> We use performance cookies enabling us to tell how
          users use our Website, such as:
        </Text>

        <div className={styles.tableContainer}>
          <Table className={styles.table}>
            <Table.Thead className={styles.tableHeader}>
              <Table.Tr>
                <Table.Th className={styles.tableHeaderCell}>Name</Table.Th>
                <Table.Th className={styles.tableHeaderCell}>Type</Table.Th>
                <Table.Th className={styles.tableHeaderCell}>
                  Expiry period (if persistent)
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>

        <Text className={styles.paragraph}>
          <strong>Marketing cookies.</strong> We use marketing cookies enabling us to decide which
          services and offers may be relevant for a user, thus tailor the ads a user sees on our
          Website and others' websites and apps, such as:
        </Text>

        <div className={styles.tableContainer}>
          <Table className={styles.table}>
            <Table.Thead className={styles.tableHeader}>
              <Table.Tr>
                <Table.Th className={styles.tableHeaderCell}>Name</Table.Th>
                <Table.Th className={styles.tableHeaderCell}>Type</Table.Th>
                <Table.Th className={styles.tableHeaderCell}>
                  Expiry period (if persistent)
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
                <Table.Td className={styles.tableCell}></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>

        <Title order={3} className={styles.subsubtitle}>
          7.2 Third party cookies
        </Title>

        <Text className={styles.paragraph}>
          We may also allow our business partners to place cookies on your device. For example, we
          use Google Analytics for web analytics, so Google may also set cookies on your device. As
          further explained below, Third Parties may also place cookies on your device for
          advertising purposes, subject to obtaining your consent for this purpose.
        </Text>

        <Text className={styles.paragraph}>
          Our partners' cookies are intended to obtain information to help them provide services to
          AIESEC. For example, Third Parties we engage to provide services to us may track your
          behavior on our Platform to market and advertise AIESEC listings or services to you on the
          Platform and Third-party websites. Please note that even if you choose not to receive
          targeted advertising, you may still receive advertising on or about the Platform – it just
          will not be tailored to your interests.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Google AdWords
        </Title>

        <Text className={styles.paragraph}>
          We're using Google AdWords online advertising, and Google AdWords is tracking conversion
          tracking. Google Conversion Tracking is an analysis service provided by Google Inc. (1600
          Amphitheater Parkway, Mountain View, CA 94043, USA, "Google"). When you click a
          Google-served ad, a conversion tracking cookie is placed on your computer. These cookies
          lose their validity after 30 days. If you visit certain pages of our website and the
          cookie has not expired, Google and we recognize that you have clicked on the ad and
          forwarded it to this page.
        </Text>

        <Text className={styles.paragraph}>
          Each Google AdWords customer receives a different cookie. The information collected using
          the conversion cookie is used to create conversion statistics for AdWords customers who
          have opted for conversion tracking. Customers can see the total number of Users who
          clicked on their ad and were forwarded to a conversion tracking tag. However, they do not
          receive any information that allows Users to be personally identified.
        </Text>

        <Text className={styles.paragraph}>
          For more information and Google's privacy policy, please visit:{' '}
          <Anchor
            href="http://www.google.com/policies/technologies/ads/"
            className={styles.link}
            target="_blank"
          >
            http://www.google.com/policies/technologies/ads/
          </Anchor>
          ,{' '}
          <Anchor
            href="http://www.google.com/policies/privacy/"
            className={styles.link}
            target="_blank"
          >
            http://www.google.com/policies/privacy/
          </Anchor>
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Google Analytics
        </Title>

        <Text className={styles.paragraph}>
          This website uses features of the web analytics service Google Analytics. Provider is the
          Google Inc. 1600 Amphitheater Parkway Mountain View, CA 94043, USA. For more information
          on how Google Analytics collects and processes information, as well as how you can control
          the information sent to Google, please review Google's site "How Google uses data when you
          use our partners' sites or apps" located at{' '}
          <Anchor
            href="http://www.google.com/policies/privacy/partners/"
            className={styles.link}
            target="_blank"
          >
            www.google.com/policies/privacy/partners/
          </Anchor>
          .
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Inspectlet
        </Title>

        <Text className={styles.paragraph}>
          We have engaged Inspectlet to analyse the user behaviour of visitors to this website and
          provide research information designed to improve the customer experience. Inspectlet's
          standard use of cookies and other tracking technologies can enable it to have access to
          Personal Information (your IP address with the last two octets of your IP-Address made
          invisible) of visitors to this website.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Adyen
        </Title>

        <Text className={styles.paragraph}>
          In the context of payment processing, we place cookies and personal data may be forwarded
          to the payment gateway providers and/or payment service providers.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Intercom
        </Title>

        <Text className={styles.paragraph}>
          Please refer to 3.2.2 for Cookies collected by Intercom on our website.
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          7.3 Third party partners & integrations
        </Title>

        <Text className={styles.paragraph}>
          The AIESEC Platform contains links to third party websites or services, such as third
          party integrations, co-branded services, or third party-branded services ("Third Party
          Partners"). AIESEC doesn't own or control these Third Party Partners and when you interact
          with them, you may be providing information directly to the Third Party Partner, AIESEC,
          or both. These Third Party Partners will have their own policy regarding the collection,
          use, and disclosure of information. We encourage you to review the privacy policies of the
          other websites you visit.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Google Maps/Earth
        </Title>

        <Text className={styles.paragraph}>
          Parts of the AIESEC Platform use Google Maps/Earth services, including the Google Maps
          API(s). Use of Google Maps/Earth is subject to Google Maps/Earth Additional Terms of Use
          and the Google Privacy Policy.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          GetResponse
        </Title>

        <Text className={styles.paragraph}>
          We use the email marketing service "GetResponse" from GetResponse Sp. Z.o., Arkonska 6 /
          A3, 80-387 Gdansk (Gdansk), Poland. If you use an offer on our website that requires the
          input of your e-mail address, it can be stored on the servers of GetResponse. GetResponse
          grants us access to this data. We use this to inform you about our work, future events,
          and information about our products and innovations on the website. You can always oppose
          the use of your data for GetResponse by activating the logoff link at the end of the
          GetResponse emails. For further information on privacy and the protection of your privacy,
          please visit{' '}
          <Anchor
            href="http://www.getresponse.de/email-marketing/legal/datenschutz.html"
            className={styles.link}
            target="_blank"
          >
            www.getresponse.de/email-marketing/legal/datenschutz.html
          </Anchor>{' '}
          and{' '}
          <Anchor href="http://www.getresponse.de/permission-seal?lang=en" className={styles.link} target="_blank">
            www.getresponse.de/permission-seal?lang=en
          </Anchor>
          .
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Google Forms
        </Title>

        <Text className={styles.paragraph}>
          We use Google Forms to create and conduct customer surveys and User surveys to improve our
          services. The data collected using a Google Forms form will be stored on Google's "Google
          Drive" cloud for us. We also collect data and files that you can upload through other
          forms that are also stored in Google Drive. For more information about Google Forms and
          Google Drive data processing, please refer to Google's privacy policy:{' '}
          <Anchor href="https://www.google.com/intl/en/policies/privacy/" className={styles.link} target="_blank">
            https://www.google.com/intl/en/policies/privacy/
          </Anchor>{' '}
          For more detailed guidance on how to manage your own data related to Google products,
          visit Google's{' '}
          <Anchor href="https://www.dataliberation.org/" className={styles.link} target="_blank">
            https://www.dataliberation.org/
          </Anchor>
          .
        </Text>

        <Title order={3} className={styles.subsubtitle}>
          7.4 Social Sharing Features
        </Title>

        <Text className={styles.paragraph}>
          The AIESEC Platform offers social sharing features and other integrated tools (such as the
          Facebook "Like" button), which let you share actions you take on our Sites with other
          media, and vice versa. The use of such features enables the sharing of information with
          your friends or the public, depending on the settings you establish with the entity that
          provides the social sharing feature.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Facebook
        </Title>

        <Text className={styles.paragraph}>
          Facebook places a cookie via the Platform that allows Facebook to obtain aggregated,
          non-Personal Information to optimize their services. For example, if an advertisement for
          the AIESEC mobile app on Facebook and subsequently installs the app, this cookie will
          inform Facebook that a User (who is not personally identified) has installed the app after
          clicking on the advertisement. This cookie may also inform Facebook that a User is using
          the app, without identifying the specific actions taken by the User in the app.
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Instagram
        </Title>

        <Text className={styles.paragraph}>
          On our pages, functions of the Instagram service are integrated. These functions are
          provided by Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA. If you are
          logged into your Instagram account, you can link the contents of our pages to your
          Instagram profile by clicking on the Instagram button. This allows Instagram to associate
          the visit of our pages with your User account. We would like to point out that as a
          provider of the pages we are not aware of the content of the transmitted data as well as
          their use by Instagram. For more information, see the Instagram Privacy Statement:{' '}
          <Anchor href="http://instagram.com/about/legal/privacy/" className={styles.link} target="_blank">
            http://instagram.com/about/legal/privacy/
          </Anchor>
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          LinkedIn
        </Title>

        <Text className={styles.paragraph}>
          Our website uses the functions of the LinkedIn network. Is the LinkedIn Corporation, 2029
          Stierlin Court, Mountain View, CA 94043, USA. Each time you visit one of our sites that
          contain LinkedIn, LinkedIn connects to LinkedIn servers. LinkedIn is informed that you
          have visited our Internet pages with your IP address. We would like to point out that as a
          provider of the pages we have no knowledge of the content of the transmitted data as well
          as their use by LinkedIn. For more information, see LinkedIn's privacy policy at{' '}
          <Anchor href="https://www.linkedin.com/legal/privacy-policy" className={styles.link} target="_blank">
            https://www.linkedin.com/legal/privacy-policy
          </Anchor>
          .
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Twitter
        </Title>

        <Text className={styles.paragraph}>
          Functions of the Twitter service are integrated on our sites. These features are offered
          by Twitter Inc., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. By using
          Twitter and the "Re-Tweet" feature, the websites you visit are linked to your Twitter
          account and shared with other Users. This data is also transmitted to Twitter. We would
          like to point out that as a provider of the pages we are not aware of the content of the
          transmitted data as well as their use by Twitter. For more information, see Twitter's
          privacy policy at{' '}
          <Anchor href="http://twitter.com/privacy" className={styles.link} target="_blank">
            http://twitter.com/privacy
          </Anchor>
          .
        </Text>

        <Text className={styles.paragraph}>
          You can change your privacy settings on Twitter in the account settings at{' '}
          <Anchor href="http://twitter.com/account/settings" className={styles.link} target="_blank">
            http://twitter.com/account/settings
          </Anchor>
          .
        </Text>

        <Title order={4} className={styles.subsubtitle}>
          Youtube
        </Title>

        <Text className={styles.paragraph}>
          Our website uses plugins from Google's YouTube site. The site is operated by YouTube, LLC,
          901 Cherry Ave., San Bruno, CA 94066, USA. If you visit one of our YouTube-enabled sites,
          you will be connected to YouTube's servers. The Youtube server is informed which of our
          pages you have visited. When you are logged in to your YouTube account, you enable YouTube
          to map your surfing behavior directly to your personal profile. You can prevent this by
          logging out of your YouTube account. For more information on how to deal with User data,
          see the YouTube Privacy Policy at{' '}
          <Anchor href="https://www.google.com/intl/en/policies/privacy" className={styles.link} target="_blank">
            https://www.google.com/intl/en/policies/privacy
          </Anchor>
        </Text>

        <Title order={2} className={styles.subtitle}>
          8. Changes to this Privacy and Cookie policy
        </Title>

        <Text className={styles.paragraph}>
          AIESEC reserves the right to modify this Privacy- and Cookie Policy at any time in
          accordance with this provision. If we make changes to this Privacy- and Cookie Policy, we
          will post the revised Privacy- and Cookie Policy on the AIESEC Platform and update the
          "Last Updated" date at the top of this Privacy- and Cookie Policy.
        </Text>

        <Title order={2} className={styles.subtitle}>
          9. Contact
        </Title>

        <Text className={styles.paragraph}>
          If you have any questions or complaints about this Privacy- and Cookie Policy or AIESEC's
          information handling practices, you may contact us at the address indicated at the
          beginning of this Privacy- and Cookie Policy. You may also email{' '}
          <Anchor href="mailto:im.srilanka@aiesec.net" className={styles.link}>
            im.srilanka@aiesec.net
          </Anchor>{' '}
          or{' '}
          <Anchor href="mailto:fouzul.hassan@aiesec.net" className={styles.link}>
            fouzul.hassan@aiesec.net
          </Anchor>{' '}
          Please expect a response within 1 month after we received your letter or email.
        </Text>
      </Stack>
    </Container>
  );
}
