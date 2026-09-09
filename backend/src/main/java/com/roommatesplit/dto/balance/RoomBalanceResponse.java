package com.roommatesplit.dto.balance;

import java.util.List;

public class RoomBalanceResponse {

    private List<MemberBalanceResponse> balances;
    private List<SettlementSuggestionResponse> simplifiedDebts;

    public RoomBalanceResponse() {
    }

    public RoomBalanceResponse(List<MemberBalanceResponse> balances, List<SettlementSuggestionResponse> simplifiedDebts) {
        this.balances = balances;
        this.simplifiedDebts = simplifiedDebts;
    }

    public List<MemberBalanceResponse> getBalances() {
        return balances;
    }

    public void setBalances(List<MemberBalanceResponse> balances) {
        this.balances = balances;
    }

    public List<SettlementSuggestionResponse> getSimplifiedDebts() {
        return simplifiedDebts;
    }

    public void setSimplifiedDebts(List<SettlementSuggestionResponse> simplifiedDebts) {
        this.simplifiedDebts = simplifiedDebts;
    }
}
