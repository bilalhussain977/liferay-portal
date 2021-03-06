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

package com.liferay.headless.foundation.resource;

import com.liferay.headless.foundation.dto.Category;
import com.liferay.headless.foundation.dto.ContentSpace;
import com.liferay.headless.foundation.dto.Email;
import com.liferay.headless.foundation.dto.Keyword;
import com.liferay.headless.foundation.dto.Organization;
import com.liferay.headless.foundation.dto.Phone;
import com.liferay.headless.foundation.dto.PostalAddress;
import com.liferay.headless.foundation.dto.Role;
import com.liferay.headless.foundation.dto.UserAccount;
import com.liferay.headless.foundation.dto.Vocabulary;
import com.liferay.headless.foundation.dto.WebSite;
import com.liferay.headless.foundation.dto.WebUrl;
import com.liferay.oauth2.provider.scope.RequiresScope;
import com.liferay.portal.vulcan.context.Pagination;
import com.liferay.portal.vulcan.dto.Page;

import java.util.Date;

import javax.annotation.Generated;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 * To access this resource, run:
 *
 *     curl -u your@email.com:yourpassword -D - http://localhost:8080/o/headless-foundation/1.0.0
 *
 * @author Javier Gamarra
 * @generated
 */
@Generated("")
@Path("/1.0.0")
public interface CategoryResource {

	@GET
	@Path("/categories/{categories-id}")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Category getCategories( @PathParam("categories-id") Long categoriesId ) throws Exception;

	@Consumes("application/json")
	@PUT
	@Path("/categories/{categories-id}")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Category putCategories( @PathParam("categories-id") Long categoriesId ) throws Exception;

	@GET
	@Path("/categories/{categories-id}/categories")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Page<Category> getCategoriesCategoriesPage( @PathParam("categories-id") Long categoriesId , @Context Pagination pagination ) throws Exception;

	@Consumes("application/json")
	@POST
	@Path("/categories/{categories-id}/categories")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Category postCategoriesCategories( @PathParam("categories-id") Long categoriesId ) throws Exception;

	@Consumes("application/json")
	@POST
	@Path("/categories/{categories-id}/categories/batch-create")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.write")
	public Category postCategoriesCategoriesBatchCreate( @PathParam("categories-id") Long categoriesId ) throws Exception;

	@GET
	@Path("/vocabularies/{vocabularies-id}/categories")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Page<Category> getVocabulariesCategoriesPage( @PathParam("vocabularies-id") Long vocabulariesId , @Context Pagination pagination ) throws Exception;

	@Consumes("application/json")
	@POST
	@Path("/vocabularies/{vocabularies-id}/categories")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.read")
	public Category postVocabulariesCategories( @PathParam("vocabularies-id") Long vocabulariesId ) throws Exception;

	@Consumes("application/json")
	@POST
	@Path("/vocabularies/{vocabularies-id}/categories/batch-create")
	@Produces("application/json")
	@RequiresScope("headless-foundation-application.write")
	public Category postVocabulariesCategoriesBatchCreate( @PathParam("vocabularies-id") Long vocabulariesId ) throws Exception;

}