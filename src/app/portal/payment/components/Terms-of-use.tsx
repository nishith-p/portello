import type React from 'react';
import { Anchor, Box, Container, List, Stack, Text, Title } from '@mantine/core';
import styles from './Terms-of-use.module.css';

export default function PrivacyPolicy() {
  return (
    <Container size="lg" className={styles.container}>
      <Stack>
        <Title order={1} className={styles.title}>
          TERMS OF USE FOR THE AIESEC INTERNATIONAL CONGRESS 2025 WEBSITE (
          <Anchor href="http://ic2025.org" className={styles.link} target="_blank">
            ic2025.org
          </Anchor>
          )
        </Title>

        <Text size="sm" className={styles.lastUpdated}>
          Effective Date: From 10th April 2025
        </Text>

        <Text className={styles.warning}>
          PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS WEBSITE.
        </Text>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            1. ACCEPTANCE OF TERMS
          </Title>
          <Text className={styles.paragraph}>
            This website (the "Site") is operated by International Congress 2025 Congress Committee
            on behalf of AIESEC International ("AIESEC," "We," "Us," or "Our") for the AIESEC
            International Congress 2025 ("Congress"). These Terms of Use ("Terms") govern your
            access to and use of the Site, including all content, information, functionalities, and
            services offered on or through the Site, such as event promotion, delegate registration,
            merchandise ordering and purchase, and payment processing for delegate fees and
            merchandise ("Services").
          </Text>
          <Text className={styles.paragraph}>
            By accessing, Browse, registering on, or otherwise using the Site, you acknowledge that
            you have read, understood, and agree to be bound by these Terms and Our{' '}
            <Anchor
              href="http://localhost:3000/portal/payment?tab=privacyPolicy"
              className={styles.link}
              target="_blank"
            >
              Privacy Policy
            </Anchor>
            , which is incorporated herein by reference. If you do not agree to these Terms or the
            Privacy Policy, you must not access or use the Site.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            2. DEFINITIONS
          </Title>
          <List className={styles.list}>
            <List.Item className={styles.listItem}>
              <Text component="span">Congress:</Text> Refers to the AIESEC International Congress
              2025 event.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Content:</Text> Refers to all text, graphics, images, logos,
              trademarks, audio, video, software, data compilations, and other information or
              material available on the Site.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Delegate:</Text> Refers to an individual registering to attend
              the Congress through the Site.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Merchandise:</Text> Refers to any official Congress-related
              products offered for sale on the Site.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Services:</Text> Refers to the functionalities provided by the
              Site, including but not limited to event information dissemination, Delegate
              registration, Merchandise ordering and purchase, and payment processing.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Site:</Text> Refers to this website, specifically developed for
              the AIESEC International Congress 2025.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">User, You, Your:</Text> Refers to any individual accessing or
              using the Site.
            </List.Item>
          </List>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            3. ELIGIBILITY
          </Title>
          <Text className={styles.paragraph}>
            Use of this Site, particularly for registration and payment Services, is intended for
            individuals who meet the eligibility criteria for attending the Congress as defined by
            AIESEC's internal regulations and Congress-specific rules. You must also be at least 18
            years of age or the age of legal majority in your jurisdiction to enter into binding
            contracts, including making payments through this Site. By using the Site, you represent
            and warrant that you meet these eligibility requirements.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            4. SITE ACCESS AND USE LICENSE
          </Title>
          <Text className={styles.paragraph}>
            AIESEC grants you a limited, non-exclusive, non-transferable, revocable license to
            access and use the Site and its Content strictly in accordance with these Terms for the
            purposes of obtaining information about the Congress, registering as a Delegate,
            ordering and purchasing Merchandise, and making related payments.
          </Text>
          <Text className={styles.paragraph}>You agree not to:</Text>
          <List type="ordered" className={styles.listAlpha}>
            <List.Item className={styles.listItem}>
              Use the Site in any way that violates any applicable federal, state, local, or
              international law or regulation.
            </List.Item>
            <List.Item className={styles.listItem}>
              Use the Site for any purpose other than its intended purposes as described herein.
            </List.Item>
            <List.Item className={styles.listItem}>
              Copy, modify, distribute, sell, lease, or create derivative works based on the Site or
              its Content without Our express written permission.
            </List.Item>
            <List.Item className={styles.listItem}>
              Use any robot, spider, or other automatic device, process, or means to access the Site
              for any purpose, including monitoring or copying any of the material on the Site.
            </List.Item>
            <List.Item className={styles.listItem}>
              Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts
              of the Site, the server on which the Site is stored, or any server, computer, or
              database connected to the Site.
            </List.Item>
            <List.Item className={styles.listItem}>
              Introduce any viruses, trojan horses, worms, logic bombs, or other material that is
              malicious or technologically harmful.
            </List.Item>
            <List.Item className={styles.listItem}>
              Otherwise attempt to interfere with the proper working of the Site.
            </List.Item>
          </List>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            5. ACCOUNT REGISTRATION AND SECURITY
          </Title>
          <Text className={styles.paragraph}>
            To access certain features of the Site, including Delegate registration and Merchandise
            purchase, you may be required to create an account. You agree to:
          </Text>
          <List type="ordered" className={styles.listAlpha}>
            <List.Item className={styles.listItem}>
              Provide accurate, current, and complete information during the registration process.
            </List.Item>
            <List.Item className={styles.listItem}>
              Maintain and promptly update your account information to keep it accurate, current,
              and complete.
            </List.Item>
            <List.Item className={styles.listItem}>
              Maintain the security and confidentiality of your account credentials (username and
              password).
            </List.Item>
            <List.Item className={styles.listItem}>
              Notify Us immediately of any unauthorized use of your account or any other breach of
              security.
            </List.Item>
            <List.Item className={styles.listItem}>
              Accept full responsibility for all activities that occur under your account, whether
              or not authorized by you.
            </List.Item>
          </List>
          <Text className={styles.paragraph}>
            AIESEC reserves the right to disable any user account at any time in Our sole discretion
            for any or no reason, including if, in Our opinion, you have violated any provision of
            these Terms.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            6. SERVICES: REGISTRATION, MERCHANDISE, AND PAYMENTS
          </Title>
          <List className={styles.list}>
            <List.Item className={styles.listItem}>
              <Text component="span">Registration:</Text> The Site facilitates registration for the
              Congress. Submitting a registration application constitutes an offer to attend,
              subject to confirmation by AIESEC International, eligibility verification, and
              adherence to payment terms. Registration is subject to availability and specific
              Congress participation rules and deadlines, which may be published separately.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Merchandise:</Text> The Site may offer official Congress
              Merchandise for purchase. All orders are subject to availability, confirmation of the
              order price, and adherence to payment terms. Prices are subject to change without
              notice.
            </List.Item>
            <List.Item className={styles.listItem}>
              <Text component="span">Payments:</Text>
              <List className={styles.list} withPadding>
                <List.Item className={styles.listItem}>
                  You agree to pay all applicable fees for Delegate registration and any Merchandise
                  ordered ("Fees") using the payment methods specified.
                </List.Item>
                <List.Item className={styles.listItem}>
                  <Text component="span">Payment Options:</Text> Fees may be payable either:
                  <List className={styles.list} withPadding>
                    <List.Item className={styles.listItem}>
                      <Text component="span">(a) Upfront Online:</Text> Through the payment methods
                      available on the Site at the time of registration or order. This is the
                      encouraged method to confirm your participation/order promptly. All pre-order
                      merch requires at least 50% of payment upfront.
                    </List.Item>
                    <List.Item className={styles.listItem}>
                      <Text component="span">(b) At the Venue:</Text> Delegate payments may be made
                      upon arrival at the Congress venue. Merch can be purchased within the
                      conference. However pricing is subject to change without notice, and some
                      merch will only be obtainable through pre-orders. Note that specific
                      conditions, deadlines, or potential consequences for choosing venue payment
                      may apply and will be communicated during registration or in official Congress
                      documentation.
                    </List.Item>
                  </List>
                </List.Item>
                <List.Item className={styles.listItem}>
                  <Text component="span">Payment Processing:</Text> Online payments are processed
                  through a third-party payment gateway provider. Your use of these payment services
                  is subject to the terms and conditions of that provider. AIESEC is not responsible
                  for any errors, omissions, or security breaches of the third-party payment
                  provider.
                </List.Item>
                <List.Item className={styles.listItem}>
                  <Text component="span">Currency:</Text> All Fees are stated in EUR. You are
                  responsible for any currency conversion charges or foreign transaction fees
                  imposed by your bank or card issuer.
                </List.Item>
                <List.Item className={styles.listItem}>
                  <Text component="span">Taxes:</Text> You are responsible for any applicable taxes
                  (e.g., VAT, sales tax) associated with your registration or purchases.
                </List.Item>
                <List.Item className={styles.listItem}>
                  <Text component="span">Refunds, Cancellations, and Penalties:</Text> All Fees,
                  whether paid online or intended for payment at the venue, are subject to the
                  official AIESEC International Congress 2025{' '}
                  <Anchor
                    href="http://localhost:3000/portal/payment?tab=refundPolicy"
                    className={styles.link}
                    target="_blank"
                  >
                    Cancellation and Refund Policy
                  </Anchor>
                  , which is incorporated herein by reference. This policy details the conditions
                  (if any) under which refunds may be issued, applicable deadlines for cancellation,
                  and any penalties or forfeiture of fees associated with late cancellations or
                  failure to attend the Congress after registration ("no-shows"). It is your
                  responsibility to read and understand this policy before completing your
                  registration or order. By proceeding with registration or an order, you
                  acknowledge and agree to the terms outlined in said policy. Except as expressly
                  stated in that policy or as required by applicable mandatory law, Fees are
                  generally non-refundable.
                </List.Item>
              </List>
            </List.Item>
          </List>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            7. INTELLECTUAL PROPERTY RIGHTS
          </Title>
          <Text className={styles.paragraph}>
            The Site and its entire Content, features, and functionality (including but not limited
            to all information, software, text, displays, images, video, audio, design, selection,
            and arrangement thereof) are owned by AIESEC, its licensors, or other providers of such
            material and are protected by international copyright, trademark, patent, trade secret,
            and other intellectual property or proprietary rights laws. The AIESEC name, the AIESEC
            logo, the Congress name and logo, and all related names, logos, product and service
            names, designs, and slogans are trademarks of AIESEC or its affiliates or licensors. You
            must not use such marks without the prior written permission of AIESEC.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            8. PRIVACY POLICY
          </Title>
          <Text className={styles.paragraph}>
            All information we collect on this Site is subject to Our{' '}
            <Anchor
              href="http://localhost:3000/portal/payment?tab=privacyPolicy"
              className={styles.link}
              target="_blank"
            >
              Privacy Policy
            </Anchor>
            . By using the Site, you consent to all actions taken by Us with respect to your
            information in compliance with the Privacy Policy.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            9. DISCLAIMER OF WARRANTIES
          </Title>
          <Text className={`${styles.paragraph} ${styles.uppercase}`}>
            THE SITE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SITE ARE PROVIDED
            ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED. NEITHER AIESEC NOR ANY PERSON ASSOCIATED WITH AIESEC MAKES ANY
            WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY,
            QUALITY, ACCURACY, OR AVAILABILITY OF THE SITE. WITHOUT LIMITING THE FOREGOING, NEITHER
            AIESEC NOR ANYONE ASSOCIATED WITH AIESEC REPRESENTS OR WARRANTS THAT THE SITE, ITS
            CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SITE WILL BE ACCURATE, RELIABLE,
            ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR SITE OR THE
            SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT
            THE SITE OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SITE WILL OTHERWISE MEET YOUR
            NEEDS OR EXPECTATIONS.
          </Text>
          <Text className={`${styles.paragraph} ${styles.uppercase}`}>
            TO THE FULLEST EXTENT PROVIDED BY LAW, AIESEC HEREBY DISCLAIMS ALL WARRANTIES OF ANY
            KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO
            ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            10. LIMITATION ON LIABILITY
          </Title>
          <Text className={`${styles.paragraph} ${styles.uppercase}`}>
            TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL AIESEC, ITS AFFILIATES, OR THEIR
            LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR
            DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR
            USE, OR INABILITY TO USE, THE SITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SITE
            OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN
            AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR
            ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY
            TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
          </Text>
          <Text className={`${styles.paragraph} ${styles.uppercase}`}>
            THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER
            APPLICABLE LAW.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            11. INDEMNIFICATION
          </Title>
          <Text className={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless AIESEC, its affiliates, licensors, and
            service providers, and its and their respective officers, directors, employees,
            contractors, agents, licensors, suppliers, successors, and assigns from and against any
            claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees
            (including reasonable attorneys' fees) arising out of or relating to your violation of
            these Terms or your use of the Site, including, but not limited to, any use of the
            Site's Content, Services, and products other than as expressly authorized in these Terms
            or your use of any information obtained from the Site.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            12. GOVERNING LAW AND JURISDICTION
          </Title>
          <Text className={styles.paragraph}>
            <Text component="span">Governing Law:</Text> All matters relating to the Site and these
            Terms and any dispute or claim arising therefrom or related thereto (in each case,
            including non-contractual disputes or claims), shall be governed by and construed in
            accordance with the internal laws of Sri Lanka, without giving effect to any choice or
            conflict of law provision or rule.
          </Text>
          <Text className={`${styles.paragraph} ${styles.uppercase}`}>
            BINDING ARBITRATION: YOU AND AIESEC AGREE THAT ANY DISPUTE, CLAIM, OR CONTROVERSY
            ARISING OUT OF OR RELATING TO THESE TERMS, THE PRIVACY POLICY, THE SITE, THE SERVICES,
            THE CONGRESS, YOUR REGISTRATION, OR ANY MERCHANDISE PURCHASED (HEREINAFTER "DISPUTE")
            SHALL BE RESOLVED SOLELY BY BINDING, INDIVIDUAL ARBITRATION AND NOT IN A COURT OF LAW.
            YOU AND AIESEC AGREE TO WAIVE THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE AS A
            PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING.
          </Text>
          <Text className={styles.paragraph}>
            The arbitration shall be administered by the Sri Lanka National Arbitration Centre
            (SLNAC) in accordance with its Rules of Arbitration ("SLNAC Rules") in effect at the
            time the arbitration is initiated.
          </Text>
          <List className={styles.list}>
            <List.Item className={styles.listItem}>
              The arbitration shall be conducted by a single arbitrator appointed in accordance with
              the SLNAC Rules.
            </List.Item>
            <List.Item className={styles.listItem}>
              The place of arbitration shall be Colombo, Sri Lanka.
            </List.Item>
            <List.Item className={styles.listItem}>
              The language of the arbitration shall be English.
            </List.Item>
            <List.Item className={styles.listItem}>
              The arbitrator's decision shall be final and binding on both parties. Judgment on the
              award rendered by the arbitrator may be entered in any court having jurisdiction
              thereof.
            </List.Item>
            <List.Item className={styles.listItem}>
              The parties agree to maintain the confidentiality of the arbitration proceedings and
              the resulting award, except as may be required by law or to enforce the award.
            </List.Item>
            <List.Item className={styles.listItem}>
              Unless otherwise agreed by the parties or determined by the arbitrator, the costs of
              the arbitration shall be borne as determined by the arbitrator in accordance with the
              SLNAC Rules.
            </List.Item>
          </List>
          <Text className={styles.paragraph}>
            <Text component="span">Exceptions to Arbitration:</Text> Notwithstanding the foregoing,
            either party retains the right to seek injunctive or other equitable relief in a court
            of competent jurisdiction to prevent the actual or threatened infringement,
            misappropriation, or violation of a party's copyrights, trademarks, trade secrets,
            patents, or other intellectual property rights.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            13. MODIFICATIONS TO THE TERMS
          </Title>
          <Text className={styles.paragraph}>
            We reserve the right, in Our sole discretion, to revise and update these Terms from time
            to time. All changes are effective immediately when We post them and apply to all access
            to and use of the Site thereafter. Your continued use of the Site following the posting
            of revised Terms means that you accept and agree to the changes. You are expected to
            check this page frequently so you are aware of any changes, as they are binding on you.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            14. TERMINATION
          </Title>
          <Text className={styles.paragraph}>
            AIESEC reserves the right to terminate or suspend your access to all or part of the Site
            for any or no reason, including without limitation, any violation of these Terms. Upon
            termination, your right to use the Site will immediately cease. Sections 6 (Payment
            obligations accrued), 7, 9, 10, 11, 12, 15, and 16 shall survive any termination.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            15. SEVERABILITY
          </Title>
          <Text className={styles.paragraph}>
            If any provision of these Terms is held by a court or other tribunal of competent
            jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision
            shall be eliminated or limited to the minimum extent such that the remaining provisions
            of the Terms will continue in full force and effect.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            16. ENTIRE AGREEMENT
          </Title>
          <Text className={styles.paragraph}>
            These Terms and Our Privacy Policy and Cancellation and Refund Policy constitute the
            sole and entire agreement between you and AIESEC regarding the Site and supersede all
            prior and contemporaneous understandings, agreements, representations, and warranties,
            both written and oral, regarding the Site.
          </Text>
        </Box>

        <Box my="lg">
          <Title order={2} className={styles.subtitle}>
            17. CONTACT INFORMATION
          </Title>
          <Text className={styles.paragraph}>
            To ask questions or comment about these Terms of Use, please contact us at:
          </Text>
          <Text className={styles.paragraph}>
            <Anchor href="mailto:ic-2025-cc@aiesec.net" className={styles.link}>
              ic-2025-cc@aiesec.net
            </Anchor>
            <br />
            102/2 Nagahawatta Rd, Maharagama, Sri Lanka.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
