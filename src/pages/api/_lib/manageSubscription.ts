import { query as faunaQuery } from 'faunadb'
import { fauna } from '../../../services/faunadb'
import { stripe } from '../../../services/stripe'


export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    const userRef = await fauna.query(
        faunaQuery.Select(
            "ref",
            faunaQuery.Get(
                faunaQuery.Match(
                    faunaQuery.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
    }

    if(createAction) {
        await fauna.query(
            faunaQuery.Create(
                faunaQuery.Collection('subscriptions'),
                { data: subscriptionData}
            )
        )
    } else {
        await fauna.query(
            faunaQuery.Replace(
                faunaQuery.Select(
                    "ref",
                    faunaQuery.Get(
                        faunaQuery.Match(
                            faunaQuery.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }


}