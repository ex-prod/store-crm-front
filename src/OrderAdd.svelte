

<div>
    <!--    <Sidebar location={location}/>-->
    <!--    <div class="relative md:ml-64 bg-gray-200">-->
    <div class="relative bg-gray-200">
        <div class="px-4 md:px-10 mx-auto w-full -m-24">
            <Router url="admin">
                <Route path="" component="{OrderList}" />
                <Route path="/order-add" component="{OrderAddForm}" />
                <!--                <Route path="settings" component="{Settings}" />-->
                <!--                <Route path="tables" component="{Tables}" />-->
                <!--                <Route path="maps" component="{Maps}" />-->
            </Router>
        </div>
    </div>
</div>