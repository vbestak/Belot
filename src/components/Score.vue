<template>
    <div id="score-container">
        <table>
            <thead>
                <td></td>
                <td>Mi</td>
                <td>Vi</td>
            </thead>
            <tr>
                <td></td>
                <td>{{ score.mi || "0"}}</td>
                <td>{{ score.vi || "0"}}</td>
            </tr>
            <tr>
                <td>Ukupno:</td>
                <td>{{ score.total.mi || "0"}}</td>
                <td>{{ score.total.vi || "0"}}</td>
            </tr>
        </table>
    </div>
</template>


<script>
export default {
    props: {
        score: Object
    }
}
</script>


<style>
#score-container{
    width: 120px;
    height: 100%;
    padding: 6px;
}
td{
    padding: 6px 6px 0;
}
</style>