/**
 * Created by ashbas on 9/4/25.
 */

import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class GraphqlContacts extends LightningElement {
  @wire(graphql, {
    query: gql`
            query getContacts {
                uiapi {
                    query {
                        Contact(
                            where: { Name: { ne: null } }
                            first: 5
                            orderBy: { Name: { order: ASC } }
                        ) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Phone {
                                        value
                                    }
                                    # We specify an alias for this custom field to ensure
                                    # that we can find it in the result even if Salesforce's
                                    # referential integrity logic updates the name. API names
                                    # for standard fields do not change, so no aliases are
                                    # needed for those.
                                    Name: Name {
                                        value
                                    }
                                    Title {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
  })
  graphql;

  get contacts() {
    return this.graphql.data?.uiapi.query.Contact.edges.map((edge) => ({
      Id: edge.node.Id,
      Name: edge.node.Name.value,
      Phone: edge.node.Phone.value,
      Title: edge.node.Title.value
    }));
  }
}