<%--
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
--%>

<%@ include file="/init.jsp" %>

<%
LayoutPageTemplateDisplayContext layoutPageTemplateDisplayContext = new LayoutPageTemplateDisplayContext(renderRequest, renderResponse, request);

request.setAttribute(LayoutAdminWebKeys.LAYOUT_PAGE_TEMPLATE_DISPLAY_CONTEXT, layoutPageTemplateDisplayContext);

LayoutPageTemplateManagementToolbarDisplayContext layoutPageTemplateManagementToolbarDisplayContext = new LayoutPageTemplateManagementToolbarDisplayContext(liferayPortletRequest, liferayPortletResponse, request, layoutPageTemplateDisplayContext);
%>

<clay:management-toolbar
	displayContext="<%= new LayoutPageTemplateManagementToolbarDisplayContext(liferayPortletRequest, liferayPortletResponse, request, layoutPageTemplateDisplayContext) %>"
/>

<portlet:actionURL name="/layout/delete_layout_page_template_entry" var="deleteLayoutPageTemplateEntryURL">
	<portlet:param name="redirect" value="<%= currentURL %>" />
</portlet:actionURL>

<aui:form action="<%= deleteLayoutPageTemplateEntryURL %>" name="fm">
	<liferay-ui:error key="<%= PortalException.class.getName() %>" message="one-or-more-entries-could-not-be-deleted" />

	<liferay-ui:search-container
		id="layoutPageTemplateEntries"
		searchContainer="<%= layoutPageTemplateDisplayContext.getLayoutPageTemplateEntriesSearchContainer() %>"
	>
		<liferay-ui:search-container-row
			className="com.liferay.layout.page.template.model.LayoutPageTemplateEntry"
			keyProperty="layoutPageTemplateEntryId"
			modelVar="layoutPageTemplateEntry"
		>

			<%
			row.setCssClass("entry-card lfr-asset-item " + row.getCssClass());
			%>

			<liferay-ui:search-container-column-text>
				<clay:vertical-card
					verticalCard="<%= new LayoutPageTemplateEntryVerticalCard(layoutPageTemplateEntry, renderRequest, renderResponse, searchContainer.getRowChecker()) %>"
				/>
			</liferay-ui:search-container-column-text>
		</liferay-ui:search-container-row>

		<liferay-ui:search-iterator
			displayStyle="icon"
			markupView="lexicon"
		/>
	</liferay-ui:search-container>
</aui:form>

<portlet:actionURL name="/layout/update_layout_page_template_entry_preview" var="updateLayoutPageTemplateEntryPreviewURL">
	<portlet:param name="redirect" value="<%= currentURL %>" />
</portlet:actionURL>

<aui:form action="<%= updateLayoutPageTemplateEntryPreviewURL %>" name="layoutPageTemplateEntryPreviewFm">
	<aui:input name="layoutPageTemplateEntryId" type="hidden" />
	<aui:input name="fileEntryId" type="hidden" />
</aui:form>

<aui:script require='<%= npmResolvedPackageName + "/js/LayoutPageTemplateEntryDropdownDefaultEventHandler.es as LayoutPageTemplateEntryDropdownDefaultEventHandler" %>'>
	Liferay.component(
		'<%= LayoutAdminWebKeys.LAYOUT_PAGE_TEMPLATE_ENTRY_DROPDOWN_DEFAULT_EVENT_HANDLER %>',
		new LayoutPageTemplateEntryDropdownDefaultEventHandler.default(
			{
				namespace: '<portlet:namespace />',
				spritemap: '<%= themeDisplay.getPathThemeImages() %>/lexicon/icons.svg'
			}
		),
		{
			destroyOnNavigate: true,
			portletId: '<%= HtmlUtil.escapeJS(portletDisplay.getId()) %>'
		}
	);
</aui:script>

<aui:script require='<%= npmResolvedPackageName + "/js/LayoutPageTemplateEntryManagementToolbarDefaultEventHandler.es as LayoutPageTemplateEntryManagementToolbarDefaultEventHandler" %>'>
	Liferay.component(
		'<%= layoutPageTemplateManagementToolbarDisplayContext.getDefaultEventHandler() %>',
		new LayoutPageTemplateEntryManagementToolbarDefaultEventHandler.default(
			{
				namespace: '<portlet:namespace />',
				spritemap: '<%= themeDisplay.getPathThemeImages() %>/lexicon/icons.svg'
			}
		),
		{
			destroyOnNavigate: true,
			portletId: '<%= HtmlUtil.escapeJS(portletDisplay.getId()) %>'
		}
	);
</aui:script>