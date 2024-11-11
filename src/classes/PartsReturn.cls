/**
 * Created by ashba on 11/9/2024.
 */

public with sharing class PartsReturn {
    public static Map<String, Integer> calculateReturnable(List<String>skuList) {
        Map<String, Integer> returnableParts = new Map<String, Integer>();
        Map<String, Integer> returnedParts = new Map<String, Integer>();

        for (String skuItem : skuList) {
            List<AggregateResult> purList = [SELECT Type, COUNT(Id) purchased FROM Order WHERE Type = 'Part' AND Name =:skuItem GROUP BY Type];
            AggregateResult pur = purList.isEmpty()? null : purList[0];

            if (pur!= null) {
                String productName = skuItem;
                Integer purchasedCount = Integer.valueOf(pur.get('purchased'));
                returnableParts.put(productName, purchasedCount );
            }

            List<AggregateResult> retList = [SELECT Type, COUNT(Id) returned FROM Order WHERE Type = 'Returned' AND Name =:skuItem GROUP BY Type];
            AggregateResult ret = retList.isEmpty()? null : retList[0];

            if (ret!= null) {
                String productName = skuItem;
                Integer returnedCount = Integer.valueOf(ret.get('returned'));
                returnedParts.put(productName, returnedCount );
            }

        }


        for (String key : returnedParts.keySet()) {
            if (returnableParts.containsKey(key)) {
                // get the values of the returned part
                Integer returnedNum = returnedParts.get(key);

                // subtract the value of the returned part from the purchased part
                Integer remainingParts = returnableParts.get(key) - returnedNum ;

                // put the subtracted value back into the purchased part
                returnableParts.put(key, remainingParts);
            }

        }

        return returnableParts;

    }
}